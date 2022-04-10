const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");
const { Command } = require("reconlx");

module.exports = new Command({
  name: "addrole",
  description:
    "Adds a role to the dropdown menu, or creates one if it doesn't already exist.",
  userPermissions: ["ADMINISTRATOR"],
  options: [
    {
      name: "channel",
      description: "The channel where the message is.",
      type: "CHANNEL",
      channelTypes: ["GUILD_TEXT"],
      required: true,
    },
    {
      name: "id",
      description: "The ID of the message you want to add the self roles to.",
      type: "STRING",
      required: true,
    },
    {
      name: "role",
      description: "The role you want to add to the message.",
      type: "ROLE",
      required: true,
    },
    {
      name: "emoji",
      description:
        "The emoji you want to use for the role. This will be added right next to the self role.",
      type: "STRING",
      required: false,
    },
    {
      name: "description",
      description:
        "The description of the role. This will be added below the self role.",
      type: "STRING",
      required: false,
    },
  ],
  run: async ({ client, interaction }) => {
    const channel = interaction.options.getChannel("channel");
    if (!channel || channel.type !== "GUILD_TEXT") {
      return interaction.reply({
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
        ephemeral: true,
      });
    }

    const messageID = interaction.options.getString("id");

    const role = interaction.options.getRole("role");
    if (!role) {
      return interaction.reply({
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
        ephemeral: true,
      });
    }

    const emoji = interaction.options.getString("emoji");

    const targetMsg = await channel.messages.fetch(messageID, {
      cache: true,
      force: true,
    });
    if (!targetMsg) {
      return interaction.reply({
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
        ephemeral: true,
      });
    }

    if (targetMsg.author.id !== client.user?.id) {
      return interaction.reply({
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
        ephemreal: true,
      });
    }

    let row = targetMsg.components[0];
    if (!row) {
      row = new MessageActionRow();
    }

    const text =
      interaction.options.getString("description") ||
      `Gives you the ${role.name} role.`;
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
          return interaction.reply({
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
            ephemeral: true,
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

    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Yay!")
          .setDescription("That role has successfully been added to the menu!")
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
