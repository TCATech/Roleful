const Discord = require("discord.js");
require("dotenv/config");
const client = new Discord.Client({
  intents: 32767,
  restTimeOffset: 0,
});
module.exports = client;

client.config = require("./config");
client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.slashCommands = new Discord.Collection();

require("./handler")(client);

client.login(process.env.TOKEN);
