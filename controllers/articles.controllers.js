const {
  updateArticle,
  selectArticleById,
  selectArticles,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

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

exports.getArticles = (req, res, next) => {
  const { sort_by, order } = req.query;
  let filter = {};

  for (let key in req.query) {
    if (key !== "sort_by" && key !== "order") {
      filter[key] = req.query[key];
    }
  }
  selectArticles(order, sort_by, filter)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};
