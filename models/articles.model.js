const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  const queryValues = [article_id];
  let queryStr = "SELECT * FROM articles WHERE article_id = $1";

  if (isNaN(article_id)) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }

  let commentQueryStr = "SELECT * FROM comments WHERE article_id = $1";
  const articlePromise = db.query(queryStr, queryValues);
  const commentPromise = db.query(commentQueryStr, queryValues);
  const promises = [articlePromise, commentPromise];
  return Promise.all(promises).then((result) => {
    const articleObj = result[0].rows[0];

    if (result[0].rows.length) {
      articleObj.comment_count = result[1].rows.length;
    } else {
      return Promise.reject({
        status: 404,
        msg: `no article found for article_id ${article_id}`,
      });
    }
    return articleObj;
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
