const db = require("../db/connection");

exports.selectTopics = () => {
  const queryValues = [];
  let queryStr = "SELECT * FROM topics";

  return db.query(queryStr, queryValues).then((result) => {
    return result.rows;
  });
};

exports.updateArticle = (article_id, input) => {
  const value = input.inc_votes;
  const queryValues = [value, article_id];
  const queryStr =
    "UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *";
  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows[0];
  });
};
