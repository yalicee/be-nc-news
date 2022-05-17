const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  const queryValues = [article_id];
  let queryStr = "SELECT * FROM articles WHERE article_id = $1";

  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  queryStr =
    "SELECT articles.*, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments on comments.article_id = articles.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id";

  return db.query(queryStr, queryValues).then((result) => {
    if (!result.rows.length) {
      return Promise.reject({
        status: 404,
        msg: `no article found for article_id ${article_id}`,
      });
    }
    return result.rows[0];
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
