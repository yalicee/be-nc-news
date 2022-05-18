const express = require("express");
const {
  patchArticle,
  getArticleById,
  getArticles,
} = require("./controllers/articles.controllers");
const {
  getCommentsByArticleId,
  postComment,
} = require("./controllers/comments.controllers");
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

app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticle);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postComment);

app.use(handlesNotFoundErrors);

app.use(handlesPSQLErrors);

app.use(handlesCustomErrors);

app.use(handlesInternalServerErrors);

module.exports = app;
