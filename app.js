const express = require("express");
const apiRouter = require("./routes/api-router");
const app = express();
app.use(express.json());

const {
  handlesPSQLErrors,
  handlesCustomErrors,
  handlesInternalServerErrors,
  handlesNotFoundErrors,
} = require("./controllers/errors.controllers");

app.use("/api", apiRouter);

app.use(handlesNotFoundErrors);

app.use(handlesPSQLErrors);

app.use(handlesCustomErrors);

app.use(handlesInternalServerErrors);

module.exports = app;
