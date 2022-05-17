const db = require("../db/connection");

exports.selectTopics = () => {
  const queryValues = [];
  let queryStr = "SELECT * FROM topics";

  return db.query(queryStr, queryValues).then(({ rows }) => {
    return rows;
  });
};

exports.selectArticleById = (article_id) => {
  const queryValues = [article_id];
  let queryStr = "SELECT * FROM articles WHERE article_id = $1";

  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return db.query(queryStr, queryValues).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        msg: `no article found for article_id ${article_id}`,
      });
    }
    return rows[0];
  });
};
