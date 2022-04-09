const { Client, MessageEmbed } = require("discord.js");
const model = require("../models/verify");

/**
 *
 * @param {Client} client
 */
module.exports = async (client) => {
  client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    const { customId, member } = interaction;
    if (customId === "roleful-verify") {
      const data = await model.findOne({
        Guild: interaction.guild.id,
      });

      if (!data) return;

      const role = interaction.guild.roles.cache.get(data.Role);

      if (member.roles.cache.has(role.id))
        return interaction.reply({
          embeds: [
            new MessageEmbed()
              .setTitle("Uh oh...")
              .setDescription("You're already verified.")
              .setColor(client.config.color)
              .setFooter({
                text: `Powered by ${client.user.username}`,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              })
              .setTimestamp(),
          ],
          ephemeral: true,
        });

      member.roles.add(role);

      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Yay!")
            .setDescription("I have successfully verified you!")
            .setColor(client.config.color)
            .setFooter({
              text: `Powered by ${client.user.username}`,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
        ephemeral: true,
      });
    }
  });
};
