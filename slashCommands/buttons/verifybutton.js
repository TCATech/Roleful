const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { Command } = require("reconlx");
const model = require("../../models/verify");

module.exports = new Command({
  name: "verifybutton",
  description: "Adds a little verify button to the message.",
  options: [
    {
      name: "channel",
      description: "The channel where the interaction is.",
      type: "CHANNEL",
      required: true,
      channelTypes: ["GUILD_TEXT"],
    },
    {
      name: "id",
      description: "The ID of the interaction you want to add verification to.",
      type: "STRING",
      required: true,
    },
    {
      name: "role",
      description: "The role you want to use.",
      type: "ROLE",
      required: true,
    },
  ],
  userPermissions: ["ADMINISTRATOR"],
  run: async ({ client, interaction }) => {
    const channel = interaction.options.getChannel("channel");
    if (!channel || channel.type !== "GUILD_TEXT") {
      return interaction.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh...")
            .setDescription(
              "You didn't mention a text channel to send the interaction to. Please do."
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

    const interactionID = interaction.options.getString("id");

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

    const targetMsg = await channel.messages.fetch(interactionID, {
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
        ephemeral: true,
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
      Guild: interaction.guild.id,
    });
    if (data) {
      await model.findOneAndRemove({
        Guild: interaction.guild.id,
      });

      let newData = new model({
        Guild: interaction.guild.id,
        Role: role.id,
      });
      newData.save();
    } else {
      let newData = new model({
        Guild: interaction.guild.id,
        Role: role.id,
      });
      newData.save();
    }

    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setTitle("Yay!")
          .setDescription("A verify button has been added to that message.")
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
