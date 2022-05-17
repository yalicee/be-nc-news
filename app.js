const express = require("express");
const { patchArticle } = require("./controllers/article-controller");
const { getTopics } = require("./controllers/topic-controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.patch("/api/articles/:article_id", patchArticle);

app.use((err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
});


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
