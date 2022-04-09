const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "sendmessage",
  description:
    "Sends a message to a channel, where you can then add the dropdown self roles.",
  usage: "<#channel> <message>",
  userPerms: ["ADMINISTRATOR"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const channel = message.mentions.channels.first();
    if (!channel || channel.type !== "GUILD_TEXT") {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh...")
            .setDescription(
              "You didn't mention a text channel to send the message to. Please do."
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

    args.shift(); // Removes the channel from the args array.
    const text = args.join(" ");

    return message.reply({
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
    });

    // channel.send(text);

    // message.reply({
    //   embeds: [
    //     new MessageEmbed()
    //       .setTitle("Yay!")
    //       .setDescription(
    //         "The message has been sent to the <#" + channel + "> channel."
    //       )
    //       .setColor(message.color)
    //       .setFooter({
    //         text: client.user.username,
    //         iconURL: client.user.displayAvatarURL({ dynamic: true }),
    //       })
    //       .setTimestamp(),
    //   ],
    // });
  },
};
