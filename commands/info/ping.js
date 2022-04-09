const { Message, Client, MessageEmbed } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "ping",
  description: "Tells you how much latency the bot currently has.",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message) => {
    const res = await message.reply({
      content: "Pinging...",
    });

    const ping = res.createdTimestamp - message.createdTimestamp;

    const embed = new MessageEmbed()
      .setTitle("Beep.")
      .addField("Bot Latency", `${ping}ms`, true)
      .addField("API Latency", `${client.ws.ping}ms`, true)
      .addField("Uptime", ms(client.uptime), false)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor(message.color)
      .setTimestamp();
    res.edit({
      content: "\u200B",
      embeds: [embed],
    });
  },
};
