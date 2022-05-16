const { selectTopics, updateArticle } = require("../models/topic-model");

exports.getTopics = (req, res, next) => {
  selectTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchArticle = (req, res, next) => {
  const { article_id } = req.params;
  updateArticle(article_id)
    .then((article) => {
      res.status.send(201).send({ article });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
