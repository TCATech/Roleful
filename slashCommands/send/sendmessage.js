const { MessageEmbed } = require("discord.js");
const { Command } = require("reconlx");

module.exports = new Command({
  name: "sendmessage",
  description:
    "Sends a message to a channel, where you can then add the dropdown self roles.",
  userPermissions: ["ADMINISTRATOR"],
  options: [
    {
      name: "channel",
      description: "The channel to send the message to.",
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
      required: true,
    },
    {
      name: "message",
      description: "The message you want to send.",
      type: "STRING",
      required: true,
    },
  ],
  run: async ({ client, interaction }) => {
    const channel = interaction.options.getChannel("channel");

    const text = interaction.options.getString("message");

    channel.send(text);

    interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Yay!")
          .setDescription(
            "The message has been sent to the <#" + channel + "> channel."
          )
          .setColor(interaction.color)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp(),
      ],
      ephemeral: true,
    });
  },
});
