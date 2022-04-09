const { MessageEmbed } = require("discord.js");
const client = require("../index");
const prefixModel = require("../models/prefix");

client.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  const data = await prefixModel.findOne({
    Guild: message.guild.id,
  });

  let prefix = "";

  if (data) {
    prefix = data.Prefix;
  } else if (!data) {
    prefix = client.config.prefix;
  }

  message.prefix = prefix;

  if (!message.content.toLowerCase().startsWith(prefix)) return;

  message.color = client.config.color;

  const [cmd, ...args] = message.content.slice(prefix.length).trim().split(" ");

  const command =
    client.commands.get(cmd.toLowerCase()) ||
    client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));

  if (!command) return;

  try {
    if (
      command.userPerms &&
      !message.member.permissions.has(command.userPerms)
    ) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh...")
            .setDescription(
              "You don't have enough permissions. Please get the following permissions:\n\n" +
                `\`${command.userPerms
                  .map(
                    (value) =>
                      `${
                        value[0].toUpperCase() +
                        value.toLowerCase().slice(1).replace(/_/gi, " ")
                      }`
                  )
                  .join(", \n")}\``
            )
            .setColor("RED")
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
      });
    }

    if (
      command.botPerms &&
      !message.guild.me.permissions.has(command.botPerms)
    ) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh...")
            .setDescription(
              "I don't have enough permissions. Please give me the following permissions:\n\n" +
                `\`${command.botPerms
                  .map(
                    (value) =>
                      `${
                        value[0].toUpperCase() +
                        value.toLowerCase().slice(1).replace(/_/gi, " ")
                      }`
                  )
                  .join(", \n")}\``
            )
            .setColor("RED")
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
      });
    }

    await command.run(client, message, args);
  } catch (err) {
    message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Uh oh...")
          .setDescription(
            "There was an error while executing that command. Please try again, and if it still doesn't work, contact <@" +
              client.config.ownerID +
              ">."
          )
          .addField("Error", err.toString())
          .setColor("RED")
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp(),
      ],
    });
  }
});
