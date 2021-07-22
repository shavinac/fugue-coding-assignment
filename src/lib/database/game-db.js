import https from "https";
import { v4 as uuidv4 } from "uuid";

import * as questionDb from "./question-db.js";

/* Game DB
key = `gid` game id
value = 
{ 
  questions: string[], // list of foreign keys - question ids
  currentRound: number,
  player: string, // foreign key - user ID
  responses: {
    [qid]: string
  }, // user's answers so far
}

Game Data Object
{
  gid: string, // Key
  questions: string[],
  currentRound: number,
  player: string,
  responses: {
    [qid]: string
  }
}
*/

var GAME_DB = {};

/* ===== Getter Functions ===== */
/**
 * Returns an array of all games in the DB
 * @returns Array of Game objects
 */
export const getAllGames = () => {
  const output = [];
  for (const gameId of Object.keys(GAME_DB)) {
    output.push({ gameId, ...GAME_DB[gameId] });
  }

  return output;
};

/**
 * Returns a Game object of the given id, if it exists. Otherwise returns undefined
 * @param {string} gameId
 * @returns A Game object
 */
export const getGameById = (gameId) => {
  return GAME_DB[gameId];
};

/**
 * Returns the current round of the Game with the given id. Returns null if id cannot be found
 * @param {string} gameId
 * @returns number
 */
export const getGameCurrentRound = (gameId) => {
  return GAME_DB[gameId]?.currentRound;
};

/**
 * Returns False if the Game is not complete. Returns True if the game is complete or doesn't exist.
 * @param {string} gameId
 * @returns boolean
 */
export const isGameOver = (gameId) => {
  if (GAME_DB[gameId] == undefined) {
    return true;
  }
  return GAME_DB[gameId].currentRound >= GAME_DB[gameId].questions.length;
};

/* ===== Create Function ===== */
/**
 * Creates a new Game using questions from OpenTrivia
 * @param {string} userId
 * @returns gid - the id of the new Game
 */
export const createGame = (userId) => {
  const gameId = uuidv4();
  const questionIds = [];

  // Get quiz ?s from OpenTrivia HTTPS request
  const quizSourceUrl = "https://opentdb.com/api.php?amount=10";
  const callback = (resp) => {
    let data = "";

    // Stream data
    resp.on("data", (chunk) => {
      data += chunk;
    });

    // The whole response has now been received
    resp.on("end", () => {
      const parsedQuizData = JSON.parse(data);
      const rawQuestions = parsedQuizData.results;

      // create a new entry for each question
      for (let i = 0; i < rawQuestions.length; i++) {
        const { question, correct_answer, incorrect_answers } = rawQuestions[i];
        const allAnswers = shuffleArray([...incorrect_answers, correct_answer]);

        const qid = questionDb.createQuestion(
          gameId,
          question,
          allAnswers,
          correct_answer
        );
        questionIds.push(qid);
      }

      GAME_DB[gameId] = {
        questions: questionIds,
        currentRound: 0,
        player: userId,
        responses: {},
      };
    });
  };

  https.get(quizSourceUrl, callback).on("error", (err) => {
    console.log("Error: " + err.message);
  });

  return gameId;
};

/**
 * Helper function. Returns a new array where elements are shifted to the right by a random number
 * @param {any[]} arr
 * @returns newArr - a new array consisting of the shuffled items
 */
const shuffleArray = (arr) => {
  const newArr = [...arr];
  let i = Math.floor(Math.random() * arr.length);
  while (i--) {
    newArr.unshift(newArr.pop());
  }
  return newArr;
};

/* ===== Updating Functions ===== */
/**
 * Record or overwrite a user-submitted answer to a game question.
 * Also advances the currentRound if a new question was answered
 * @param {string} gameId
 * @param {string} questionId
 * @param {number} answer
 */
export const recordAnswer = (gameId, questionId, answer) => {
  // only advance the game if a new question was answered
  if (GAME_DB[gameId].responses[questionId] == undefined) {
    GAME_DB[gameId].currentRound += 1;
  }
  GAME_DB[gameId].responses[questionId] = answer;
};
