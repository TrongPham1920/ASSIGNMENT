require("dotenv").config();

const express = require("express");
const MongoDB = require("./database/mongodb");
const router = require("./server/router");

const cors = require("cors");

var corsOptionsDelegate = function (req, callback) {
  var corsOptions = { origin: true };
  callback(null, corsOptions);
};

const app = express();

app.use(express.json());
app.use(cors(corsOptionsDelegate));
app.use(router);

module.exports = app;
