const {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const model = require("../../models/verify");

module.exports = {
  name: "verifybutton",
  description: "Adds a little verify button to the message.",
  usage: "<#channel> <message ID> <role (ping, name, or ID)>",
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

    const messageID = args[1];

    const role =
      message.mentions.roles.first() ||
      message.guild.roles.cache.get(args[2]) ||
      message.guild.roles.cache.find((role) => role.name === args[2]);
    if (!role) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh...")
            .setDescription(
              "You didn't mention a role, or it doesn't exist. Please mention a role or it's name."
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

    const targetMsg = await channel.messages.fetch(messageID, {
      cache: true,
      force: true,
    });
    if (!targetMsg) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh...")
            .setDescription(
              "That message doesn't exist. Try sending a message to the <#" +
                channel +
                "> channel by using r!send."
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

    if (targetMsg.author.id !== client.user?.id) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh...")
            .setDescription(
              "You specified a message that wasn't sent by me. Try sending a message to the <#" +
                channel +
                "> channel by using r!send."
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

    const row = new MessageActionRow();

    row.addComponents(
      new MessageButton()
        .setCustomId("roleful-verify")
        .setEmoji("✅")
        .setLabel("Verify")
        .setStyle("SUCCESS")
    );

    targetMsg.edit({
      components: [row],
    });

    const data = await model.findOne({
      Guild: message.guild.id,
    });
    if (data) {
      await model.findOneAndRemove({
        Guild: message.guild.id,
      });

      let newData = new model({
        Guild: message.guild.id,
        Role: role.id,
      });
      newData.save();
    } else {
      let newData = new model({
        Guild: message.guild.id,
        Role: role.id,
      });
      newData.save();
    }

    return message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Yay!")
          .setDescription("A verify button has been added to that message.")
          .setColor(message.color)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp(),
      ],
    });
  },
};
