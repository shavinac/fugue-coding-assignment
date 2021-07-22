import * as gamedb from "../../database/game-db.js";
import * as questionDb from "../../database/question-db.js";
import * as userdb from "../../database/user-db.js";

/**
 * Starts a new game for a user
 * @param {string} userId
 * @returns {string} gameId
 */
export const startGame = (userId) => {
  const newGameId = gamedb.createGame(userId);

  let user = userdb.getUserById(userId);
  if (user == undefined) {
    userdb.createUser(userId);
  }

  userdb.updateUserCurrentGame(userId, newGameId);

  return newGameId;
};

/**
 * Retrieves a question from the quiz
 * If the requested game is already complete, or if the requested game cannot be found, returns a message.
 * @param {string} gameId
 * @returns {*} { qid: string, question: string, answers: string[], round: number }
 */
export const getNextQuestion = (gameId) => {
  if (gamedb.isGameOver(gameId)) {
    return { message: "Sorry, this game is already completed" };
  }

  const game = gamedb.getGameById(gameId);

  if (game == null || game == undefined) {
    console.log("ERROR: Unknown game id");
    return { message: "Sorry, this is not a valid game id" };
  }

  const { currentRound, questions: questionIds } = game;
  const { question, answers } = questionDb.getQuestionById(
    questionIds[currentRound]
  );
  return {
    qid: questionIds[currentRound],
    question,
    answers,
    round: currentRound,
  };
};

/**
 * Record a user-submitted answer to the question
 * @param {string} qid
 * @param {number} answer
 * @returns {*} { correct, score, complete }
 */
export const answerQuestion = (qid, answer) => {
  const { gameId, correctAnswer } = questionDb.getQuestionById(qid);
  const { player, currentRound, questions } = gamedb.getGameById(gameId);
  const questionNumber = questions.indexOf(qid);

  gamedb.recordAnswer(gameId, qid, answer);

  const correct = answer === correctAnswer;

  // only increase score if this was a *new* question answered
  if (correct && questionNumber === currentRound) {
    userdb.increaseUserScore(player);
  }

  const score = userdb.getUserScore(player);
  const complete = gamedb.isGameOver(gameId);

  return { correct, score, complete };
};
