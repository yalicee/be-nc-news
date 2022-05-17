const express = require("express");
const {
  patchArticle,
  getArticleById,
} = require("./controllers/articles.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getUsers } = require("./controllers/users.controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticle);

app.get("/api/users", getUsers);

app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "not found" });
});

app.use((err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
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
