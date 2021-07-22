import express from "express";

// Used in debugging-only routes
import * as gamedb from "./lib/database/game-db.js";
import * as questiondb from "./lib/database/question-db.js";
import * as userdb from "./lib/database/user-db.js";

import {
  answerQuestion,
  getNextQuestion,
  startGame,
} from "./lib/functions/quiz/index.js";

var app = express();
app.use(express.json()); // for parsing application/json

app.get("/", (req, res, next) => {
  res.json("Hello, welcome to Quiz Game!");
});

// Debugging: show all quizzes
app.get("/quizzes", (req, res, next) => {
  res.json(gamedb.getAllGames());
});

// Debugging: show all users
app.get("/users", (req, res, next) => {
  res.json(userdb.getAllUsers());
});

// Debugging: show full question data including correct answer
app.get("/cheat", (req, res, next) => {
  const qid = req.query.qid;
  res.json(questiondb.getQuestionById(qid));
});

/* Starts a new game.
Expects request body: { uid: string }
Reponse: { gid: string }
*/
app.post("/start", (req, res, next) => {
  const { uid } = req.body;
  res.json({ gid: startGame(uid) });
});

/* Retrieves the next unanswered question from the game.
Expects request body: { gid: string }
Reponse: { qid: string, question: string, answers: string[], round: number }
*/
app.get("/question", (req, res, next) => {
  const { gid } = req.body;
  res.json(getNextQuestion(gid));
});

app.post("/answer", (req, res, next) => {
  const { qid, answer } = req.body;
  res.json(answerQuestion(qid, answer));
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
