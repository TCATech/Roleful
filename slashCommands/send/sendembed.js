const { MessageEmbed } = require("discord.js");
const { Command } = require("reconlx");

module.exports = new Command({
  name: "sendembed",
  description:
    "Sends a beautiful embed to a channel, where you can then add the dropdown self roles.",
  userPermissions: ["ADMINISTRATOR"],
  run: async ({ interaction }) => {
    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Uh oh...")
          .setDescription(
            "Embeds are currently not supported as of right now. Please use a normal text message for now instead."
          )
          .setColor("RED")
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
