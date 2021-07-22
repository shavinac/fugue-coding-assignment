# Trivia Quiz API - Fugue Assignment

Author: Shavina Chau

## Getting Started

1. Clone the GitHub repository
2. Install the required NodeJS packages/libraries.
3. Start the server with `npm start` (running on port 3000)

```
git clone git@github.com:shavinac/fugue-coding-assignment.git
cd fugue-coding-assignment
npm install
npm start
```

## API Endpoints

### Start the Quiz

- Endpoint: http://localhost:3000/start
- Expects a POST request with a `Content-Type: application/json` body `{ uid: String }`
- Returns a JSON object `{ gid: String }`

### Get a Quiz Question

- Endpoint: http://localhost:3000/question
- Expects a GET request with a `Content-Type: application/json` body `{ gid: String }`
- Returns a JSON object `{ qid: String, question: String, answers: String[], round: Number }`

### Submit an Answer

- Endpoint: http://localhost:3000/answer
- Expects a POST request with a `Content-Type: application/json` body `{ qid: String, answer: Number }`
- Returns a JSON object `{ correct: Boolean, score: Number, complete: Boolean }`

---

### Debugging Endpoints

I set up additional endpoints for manual debugging purposes, I left them exposed if you'd like to try them out.

- http://localhost:3000/quizzes - Returns all quiz games
- http://localhost:3000/users - Returns all users
- http://localhost:3000/cheat?qid=`{questionid}` - Returns full question data for a given question id. Helpful for peeking at the correct answers :P

---

## Author Notes

### Implementation Choices

- This is set up as a NodeJS app using an Express server - this is the tech stack I am most comfortable with at the moment, since in my previous role I heavily used JS/TS with Node.
- Game, Question, and User "databases" are stored as in-memory JS objects. This was the simplest and fastest way to maintain server state. If I had more time, I'd like to set up a relational DB to manage data and enforce constraints such as foreign key relationships.
- No testing has been set up, but if I had more time, I'd prioritize writing unit tests for the quiz functions (in `src/lib/functions/quiz/index.js`) since those implement the bulk of the game logic. After that, I would write unit tests for the db CRUD functions, particularly for checking that new objects are initialized with the correct values. It would also be nice to have integration tests for the db functions (e.g. create -> update -> delete flow), and tests for the API endpoints.

### Extensions and Future Features

- Let the user review their answers at the end. In the Game DB, I kept track of "user responses" in a mapping { qid: answer } - if we exposed this along with a proper endpoint for retrieving full question data, this could be displayed in the front end as a "review section" where the user can go back to look at the question text, possible answers, their answer, and the correct answer.
- A "school test" mode where the user doesn't see their score until after the quiz is complete, but they'll be able to skip questions, or go back to previous questions and change their answer.
- Let the user start another quiz before completing their first quiz - basically letting the user have multiple "open" quizzes at a time. In the User DB, each user has only one "current quiz", but this could be changed to be an array of quiz ids. We could also allow the user to review "past quizzes" that are already complete.
- A "battle" mode where two (or more!) users could take the same quiz, and try to get the highest score. If we kept track of the time between question request and answer submission, we could also factor in speediness in the "player score" - faster (correct!) answers gets you a higher score!
- The OpenTrivia API provides additional information and controls like category and difficulty - we could display this information to the user, and perhaps factor in difficulty into calculating the score. We could also allow the user to control and choose these parameters.

I had a great time with the assignment - I like trivia games a lot, especially with friends/teammates. :D
