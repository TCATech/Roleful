const { Client, interaction } = require("discord.js");
const { Command } = require("reconlx");
const prefixModel = require("../../models/prefix");

module.exports = new Command({
  name: "updateprefix",
  description: "Changes the prefix for your server.",
  userPermissions: ["ADMINISTRATOR"],
  options: [
    {
      name: "newprefix",
      description: "The new prefix you want to use.",
      type: "STRING",
      required: true,
    },
  ],
  run: async ({ client, interaction }) => {
    const data = await prefixModel.findOne({
      Guild: interaction.guild.id,
    });
    const newprefix = interaction.options.getString("newprefix");
    if (!newprefix)
      return interaction.reply({
        content: "Please specify the new prefix!",
        ephemeral: true,
      });
    if (newprefix.length > 5)
      return interaction.reply({
        content: "Your new prefix must be under `5` characters!",
        ephemeral: true,
      });
    if (data) {
      await prefixModel.findOneAndRemove({
        Guild: interaction.guild.id,
      });

      if (newprefix === client.config.prefix || newprefix === "reset") {
        interaction.reply({
          content: `${client.user.username}'s prefix is now back to the default which is \`${client.config.prefix}\`.`,
          ephemeral: true,
        });

        let newData = new prefixModel({
          Prefix: client.config.prefix,
          Guild: interaction.guild.id,
        });
        return newData.save();
      }

      interaction.reply({
        content: `${client.user.username}'s prefix is now \`${newprefix}\`.`,
        ephemeral: true,
      });

      let newData = new prefixModel({
        Prefix: newprefix,
        Guild: interaction.guild.id,
      });
      newData.save();
    } else if (!data) {
      interaction.reply({
        content: `${client.user.username}'s prefix is now \`${newprefix}\`.`,
        ephemeral: true,
      });
      let newData = new prefixModel({
        Prefix: newprefix,
        Guild: interaction.guild.id,
      });
      newData.save();
    }
  },
});
