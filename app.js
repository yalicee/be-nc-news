const express = require("express");
const { getTopics, patchArticle } = require("./controllers/topic-controller");

const app = express();
app.get("/api/topics", getTopics);

app.patch("/api/artices/1", patchArticle);

app.use("/*", (req, res, next) => {
  res.status(404).send({ msg: "not found" });
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
});

module.exports = app;
