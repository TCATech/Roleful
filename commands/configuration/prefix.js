const { Client, Message } = require("discord.js");
const prefixModel = require("../../models/prefix");

module.exports = {
  name: "prefix",
  description: "Changes the prefix for your server.",
  usage: "<new prefix>",
  userPerms: ["MANAGE_GUILD"],
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const data = await prefixModel.findOne({
      Guild: message.guild.id,
    });
    if (!args[0]) return message.reply("Please specify the new prefix!");
    if (args[0].length > 5)
      return message.reply("Your new prefix must be under `5` characters!");
    if (data) {
      await prefixModel.findOneAndRemove({
        Guild: message.guild.id,
      });

      if (args[0] === client.config.prefix || args[0] === "reset") {
        message.reply(
          `Roleful's prefix is now back to the default which is \`${client.config.prefix}\`.`
        );

        let newData = new prefixModel({
          Prefix: client.config.prefix,
          Guild: message.guild.id,
        });
        return newData.save();
      }

      message.reply(`Roleful's prefix is now \`${args[0]}\`.`);

      let newData = new prefixModel({
        Prefix: args[0],
        Guild: message.guild.id,
      });
      newData.save();
    } else if (!data) {
      message.reply(`Roleful's prefix is now \`${args[0]}\`.`);
      let newData = new prefixModel({
        Prefix: args[0],
        Guild: message.guild.id,
      });
      newData.save();
    }
  },
};
