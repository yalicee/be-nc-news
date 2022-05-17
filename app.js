const express = require("express");
const {
  patchArticle,
  getArticleById,
} = require("./controllers/articles.controllers");
const {
  handlesPSQLErrors,
  handlesCustomErrors,
  handlesInternalServerErrors,
  handlesNotFoundErrors,
} = require("./controllers/errors.controllers");
const { getTopics } = require("./controllers/topics.controllers");
const { getUsers } = require("./controllers/users.controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticle);

app.get("/api/users", getUsers);

app.use("/*", handlesNotFoundErrors);

app.use(handlesPSQLErrors);

app.use(handlesCustomErrors);

app.use(handlesInternalServerErrors);

module.exports = app;
