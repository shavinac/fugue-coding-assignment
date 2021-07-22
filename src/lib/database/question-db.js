import { v4 as uuidv4 } from "uuid";
/* Questions DB
key = `qid` question id
value = 
{
  gameId: string, // foreign key - game id
  question: string,
  answers: string[],
  correctAnswer: number, // index of the correct answer in `answers` array
}

Question Data Object
{
    qid: string, // Key
    gameId: string,
    question: string,
    answers: string[],
    correctAnswer: number
}
*/

var QUESTION_DB = {};

/**
 * Returns an array of all questions from a given game
 * @param {string} gameId
 * @returns An Array of Question objects
 */
export const getQuestionsByGameId = (gameId) => {
  const output = [];
  for (const qid of Object.keys(QUESTION_DB)) {
    if (QUESTION_DB[qid].gameId === gameId) {
      output.push({ qid, ...QUESTION_DB[qid] });
    }
  }

  return output;
};

/**
 * Returns a Question object of the given id, if it exists. Otherwise returns undefined
 * @param {string} qid
 * @returns A Question object
 */
export const getQuestionById = (qid) => {
  return QUESTION_DB[qid];
};

/**
 * Create a new question
 * @param {string} gameId
 * @param {string} question question text
 * @param {string[]} answers array of answer texts
 * @param {string} correctAnswer correct answer text
 * @returns {string} qid
 */
export const createQuestion = (gameId, question, answers, correctAnswer) => {
  const qid = uuidv4();

  const correctAnswerIndex = answers.indexOf(correctAnswer);

  QUESTION_DB[qid] = {
    gameId,
    question,
    answers,
    correctAnswer: correctAnswerIndex,
  };
  return qid;
};
