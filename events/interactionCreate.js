const client = require("../index");
const prefixModel = require("../models/prefix");

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const data = await prefixModel.findOne({
      Guild: interaction.guild.id,
    });

    let prefix = "";

    if (data) {
      prefix = data.Prefix;
    } else if (!data) {
      prefix = client.config.prefix;
    }

    interaction.messagePrefix = prefix;

    interaction.color = client.config.color;
    const cmd = client.slashCommands.get(interaction.commandName);
    if (!cmd)
      message.reply({
        embeds: [
          new MessageEmbed()
            .setTitle("Uh oh...")
            .setDescription(
              "There was an error while executing that command. Please try again, and if it still doesn't work, contact <@" +
                client.config.ownerID +
                ">."
            )
            .addField("Error", "NotFoundError: Command not found.")
            .setColor("RED")
            .setFooter({
              text: client.user.username,
              iconURL: client.user.displayAvatarURL({ dynamic: true }),
            })
            .setTimestamp(),
        ],
      });

    const args = [];

    for (let option of interaction.options.data) {
      if (option.type === "SUB_COMMAND") {
        if (option.name) args.push(option.name);
        option.options?.forEach((x) => {
          if (x.value) args.push(x.value);
        });
      } else if (option.value) args.push(option.value);
    }
    interaction.member = interaction.guild.members.cache.get(
      interaction.user.id
    );
    try {
      cmd.run({ client, interaction, args });
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
  }
});
