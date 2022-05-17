const express = require("express");
const app = express();

exports.handlesNotFoundErrors = (req, res, next) => {
  res.status(404).send({ msg: "not found" });
};

exports.handlesPSQLErrors = (err, req, res, next) => {
  if (err.code) {
    res.status(400).send({ msg: "bad request" });
  } else {
    next(err);
  }
};

exports.handlesCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handlesInternalServerErrors = (err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
};
