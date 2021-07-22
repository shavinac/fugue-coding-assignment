/* User DB
key = `uid` user id
value = 
{
    currentQuiz: string | null, // foreign key - gameId of current/ongoing quiz game
    score: number | null
}

User Data Object
{
    uid: string, // Key
    currentQuiz: string | null,
    score: number | null,
}
*/
var USER_DB = {};

/* ===== Getter Functions ===== */
/**
 * Returns all users in the DB
 * @returns Array of User objects
 */
export const getAllUsers = () => {
  const output = [];
  for (const userId of Object.keys(USER_DB)) {
    output.push({ userId, ...USER_DB[userId] });
  }

  return output;
};

/**
 * Returns a User object of the given id, if it exists. Otherwise returns undefined
 * @param {string} userId
 * @returns A User object
 */
export const getUserById = (userId) => {
  return USER_DB[userId];
};

/**
 * Returns the user's current score. Returns null if user does not exist
 * @param {string} userId
 * @returns number
 */
export const getUserScore = (userId) => {
  if (USER_DB[userId] == undefined) {
    console.log("WARNING: Unknown user id");
    return null;
  }
  return USER_DB[userId].score;
};

/* ===== Create Function ===== */
/**
 * Create a new user with the given id.
 * Will overwrite a user entry if duplicate id was given.
 * @param {string} userId
 */
export const createUser = (userId) => {
  if (USER_DB[userId] !== undefined) {
    console.log("WARNING: Duplicate user id");
  }

  USER_DB[userId] = {
    currentGame: null,
    score: null,
  };
};

/* ===== Updating Functions ===== */
/**
 * Assigns the Game to the User
 * @param {string} userId
 * @param {string} gameId
 * @returns gameId
 */
export const updateUserCurrentGame = (userId, gameId) => {
  if (USER_DB[userId] == undefined) {
    console.log("WARNING: Unknown user id");
    return;
  }

  USER_DB[userId] = {
    currentGame: gameId,
    score: 0,
  };

  return gameId;
};

/**
 * Increments the user's score by 1
 * @param {string} userId
 * @returns score - new score value
 */
export const increaseUserScore = (userId) => {
  if (USER_DB[userId] == undefined) {
    console.log("WARNING: Unknown user id");
    return;
  }
  USER_DB[userId].score += 1;

  return USER_DB[userId].score;
};
