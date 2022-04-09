const express = require("express");
const path = require("path");
const app = express();

module.exports = () => {
  app.listen(3000);

  app.get("/", (req, res) => {
    res.send("Hello world!");
  });
};
