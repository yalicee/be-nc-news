const db = require("../db/connection");
const format = require("pg-format");

exports.selectCommentsByArticleId = (article_id) => {
  const queryValues = [article_id];
  let queryStr = "SELECT * FROM comments WHERE article_id = $1";
  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return db.query(queryStr, queryValues).then((result) => {
    if (!result.rows.length) {
      return Promise.reject({
        status: 404,
        msg: `no comments found for article_id ${article_id}`,
      });
    }
    return result.rows;
  });
};

exports.insertComment = (article_id, inputComment) => {
  const { username, body } = inputComment;
  const queryValues = [username, body, article_id];

  let queryStr =
    "INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3)RETURNING *";

  return db.query(queryStr, queryValues).then((result) => {
    return result.rows[0];
  });
};

exports.removeComment = (comment_id) => {
  return db
    .query("DELETE FROM comments WHERE comment_id = $1 RETURNING *", [
      comment_id,
    ])
    .then((result) => {
      console.log();
      if (!result.rows.length) {
        console.log(result.rows.length);
        return Promise.reject({
          status: 404,
          msg: `no comment found for comment_id ${comment_id}`,
        });
      }
    });
};
