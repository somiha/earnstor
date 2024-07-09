const db = require("./db_connection");

// Helper function to wrap db.query in a promise
async function queryAsync(query, values) {
  try {
    const result = await db.query(query, values);
    return result[0];
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function queryAsyncWithoutValue(query) {
  try {
    const result = await db.query(query);
    return result[0];
  } catch (err) {
    throw err;
  }
}

module.exports = { queryAsync, queryAsyncWithoutValue };
