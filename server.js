const express = require("express");
const path = require("path");
const app = express();

module.exports = () => {
  app.listen(3000);

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/html/index.html"));
  });

  app.get("/invite", (req, res) => {
    res.redirect(
      "https://discord.com/oauth2/authorize?client_id=961077348550180870&scope=bot&permissions=18456"
    );
  });

  app.get("/font", (req, res) => {
    res.sendFile(path.join(__dirname, "/html/assets/fonts/Ubuntu-Bold.ttf"));
  });
};
