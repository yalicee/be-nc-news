const db = require("../db/connection");

exports.selectTopics = () => {
  const queryValues = [];
  let queryStr = "SELECT * FROM topics";

  return db.query(queryStr, queryValues).then((result) => {
    return result.rows;
  });
};

exports.selectArticleById = (article_id) => {
  const queryValues = [article_id];
  let queryStr = "SELECT * FROM articles";
  queryStr += " WHERE article_id = $1";

  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "invalid filepath" });
  }
  return db.query(queryStr, queryValues).then((result) => {
    return result.rows[0];
  });
};
