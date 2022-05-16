const express = require("express");
const { getTopics, getArticleById } = require("./controllers/topic-controller");

const app = express();

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "not found" });
});

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
