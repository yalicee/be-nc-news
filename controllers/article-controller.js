const { updateArticle } = require("../models/article-model");

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  const input = req.body;
  updateArticle(article_id, input)
    .then((article) => {
      res.status(201).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
