const {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

module.exports = {
  name: "addrole",
  description:
    "Adds a role to the dropdown menu, or creates one if it doesn't already exist.",
  usage:
    "<#channel> <message ID> <role (ping, name, or ID)> [emoji] [description]",
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

    const emoji = args[3];

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

    let row = targetMsg.components[0];
    if (!row) {
      row = new MessageActionRow();
    }

    // The following args.shifts removes all of the mentions from the args array, which include the channel, message ID, role, and emoji.
    args.shift();
    args.shift();
    args.shift();
    args.shift();

    const text = args.join(" ") || `Gives you the ${role.name} role.`;
    const options = [
      {
        label: role.name,
        value: role.id,
        description: text,
        emoji: emoji,
      },
    ];

    let menu = row.components[0];
    if (menu) {
      for (const o of menu.options) {
        if (o.value === options[0].value) {
          return message.reply({
            embeds: [
              new MessageEmbed()
                .setTitle("Uh oh...")
                .setDescription("That role is already in the menu.")
                .setColor("RED")
                .setFooter({
                  text: client.user.username,
                  iconURL: client.user.displayAvatarURL({ dynamic: true }),
                })
                .setTimestamp(),
            ],
          });
        }
      }

      menu.addOptions(options);
      menu.setMaxValues(menu.options.length);
    } else {
      row.addComponents(
        new MessageSelectMenu()
          .setCustomId("roleful-menu")
          .setMinValues(0)
          .setMaxValues(1)
          .setPlaceholder("Select your roles...")
          .addOptions(options)
      );
    }

    targetMsg.edit({
      components: [row],
    });

    return message.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Yay!")
          .setDescription("That role has successfully been added to the menu!")
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
