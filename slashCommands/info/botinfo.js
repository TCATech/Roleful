const { MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const { Command } = require("reconlx");

module.exports = new Command({
  name: "botinfo",
  description: "Tells you some info about Roleful.",
  run: async ({ client, interaction }) => {
    const embed = new MessageEmbed()
      .setAuthor({
        name: client.user.tag,
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .addField(
        "Servers watching",
        `${client.guilds.cache.size.toLocaleString()} server${
          client.guilds.cache.size > 1 ? "s" : ""
        }`,
        true
      )
      .addField(
        "Channels watching",
        client.channels.cache.size.toLocaleString(),
        true
      )
      .addField("Users watching", client.users.cache.size.toString(), true)
      .addField("Commands", client.commands.size.toLocaleString(), true)
      .addField("Prefix", `\`${interaction.messagePrefix}\``, true)
      .addField(
        "Made with",
        `[discord.js](https://github.com/discordjs/discord.js)`,
        true
      )
      .addField("Version", client.config.version, true)
      .addField(
        "Created on",
        `<t:${parseInt(client.user.createdTimestamp / 1000)}:R>`,
        true
      )
      .addField("Developer", "Not TCA#6651", true)
      .setColor(interaction.color);

    interaction.reply({
      embeds: [embed],
      components: [
        new MessageActionRow().addComponents(
          new MessageButton()
            .setStyle("LINK")
            .setLabel("Invite")
            .setURL(
              "https://discord.com/oauth2/authorize?client_id=961077348550180870&scope=bot&permissions=18456"
            )
            .setEmoji("➕")
        ),
      ],
      ephemeral: true,
    });
  },
});
