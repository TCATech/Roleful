const { Client, MessageEmbed } = require("discord.js");

/**
 *
 * @param {Client} client
 */
module.exports = (client) => {
  client.on("interactionCreate", (interaction) => {
    if (!interaction.isSelectMenu()) return;

    const { customId, values, member } = interaction;
    if (customId === "roleful-menu") {
      const component = interaction.component;
      const removed = component.options.filter((option) => {
        return !values.includes(option.value);
      });

      for (const id of values) {
        member.roles.add(id);
      }

      for (const id of removed) {
        member.roles.remove(id.value);
      }

      interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Yay!")
            .setDescription("I have successfully updated your roles!")
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
