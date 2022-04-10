const { Message, Client, MessageEmbed } = require("discord.js");
const ms = require("ms");
const { Command } = require("reconlx");

module.exports = new Command({
  name: "ping",
  description: "Tells you how much latency the bot currently has.",
  run: async ({ client, interaction }) => {
    const res = await interaction.reply({
      content: "Pinging...",
      ephemeral: true,
      fetchReply: true,
    });

    const ping = res.createdTimestamp - interaction.createdTimestamp;

    const embed = new MessageEmbed()
      .setTitle("Pong! 🏓")
      .addField("Bot Latency", `${ping}ms`, true)
      .addField("API Latency", `${client.ws.ping}ms`, true)
      .addField("Uptime", ms(client.uptime), false)
      .setFooter({
        text: client.user.username,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor(interaction.color)
      .setTimestamp();
    interaction.editReply({
      content: "\u200B",
      embeds: [embed],
    });
  },
});
