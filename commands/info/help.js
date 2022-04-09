const {
  Client,
  Message,
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

module.exports = {
  name: "help",
  description: "Get some help.",
  usage: "[command name]",
  /**
   *
   * @param {Client} client
   * @param {Message} message
   */
  run: async (client, message, args) => {
    if (args[0] && args[0].length > 0) {
      const embed = new MessageEmbed();
      const cmd =
        client.commands.get(args[0].toLowerCase()) ||
        client.commands.find((c) => c.aliases?.includes(cmd.toLowerCase()));
      if (!cmd) {
        return message.reply({
          embeds: [
            embed
              .setColor(message.color)
              .setDescription(
                `I couldn't find any information for command **${args.toLowerCase()}**`
              )
              .setTitle("Uh oh...")
              .setFooter({
                text: client.user.username,
                iconURL: client.user.displayAvatarURL({ dynamic: true }),
              })
              .setTimestamp(),
          ],
        });
      }
      if (cmd.name) embed.addField("**Command name**", `\`${cmd.name}\``);
      if (cmd.name)
        embed.setTitle(`Detailed information about:\`${cmd.name}\``);
      if (cmd.description)
        embed.addField("**Description**", `\`${cmd.description}\``);
      if (cmd.aliases)
        embed.addField(
          "**Aliases**",
          `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``
        );
      if (cmd.usage) {
        embed.addField(
          "**Usage**",
          `\`${message.prefix}${cmd.name} ${cmd.usage}\``
        );
        embed.setFooter({
          text: "Syntax: <> = required, [] = optional",
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        });
      } else {
        embed.addField("**Usage**", `\`${message.prefix}${cmd.name}\``);
        embed.setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        });
      }
      return message.reply({
        embeds: [embed.setColor(message.color).setTimestamp()],
      });
    } else {
      const directories = [
        ...new Set(client.commands.map((cmd) => cmd.directory)),
      ];

      /**
       *
       * @param {String} str
       * @returns string
       */
      const formatString = (str) =>
        `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

      const categories = directories.map((dir) => {
        const getCommands = client.commands
          .filter((cmd) => cmd.directory === dir)
          .map((cmd) => {
            return {
              name: cmd.name || "???",
              description:
                cmd.description || "No description for this command.",
            };
          });

        return {
          directory: formatString(dir),
          commands: getCommands,
        };
      });

      const embed = new MessageEmbed()
        .setTitle("Oh you need some help?")
        .setDescription(
          "Please choose a category using the dropdown menu below. If you want more help with a specific command, use `" +
            message.prefix +
            "help [command name]`"
        )
        .setColor(message.color)
        .setFooter({
          text: client.user.username,
          iconURL: client.user.displayAvatarURL({ dynamic: true }),
        })
        .setTimestamp();

      /**
       *
       * @param {Boolean} state
       * @returns MessageActionRow
       */
      const components = (state) => [
        new MessageActionRow().addComponents(
          new MessageSelectMenu()
            .setCustomId("help-menu")
            .setPlaceholder("Category...")
            .setDisabled(state)
            .addOptions(
              categories.map((cmd) => {
                return {
                  label: cmd.directory,
                  value: cmd.directory.toLowerCase(),
                  description: `Commands from the ${cmd.directory} category`,
                };
              })
            )
        ),
      ];

      const init = await message.reply({
        embeds: [embed],
        components: components(false),
      });

      const filter = (int) => int.user.id === message.author.id;

      const collector = message.channel.createMessageComponentCollector({
        filter,
        componentType: "SELECT_MENU",
        time: 30 * 1000,
      });

      collector.on("collect", (int) => {
        const [directory] = int.values;
        const category = categories.find(
          (x) => x.directory.toLowerCase() === directory
        );

        const categoryEmbed = new MessageEmbed()
          .setTitle(`${formatString(directory)} commands`)
          .setDescription(
            `Here is a list of commands from the ${directory} category.`
          )
          .addFields(
            category.commands.map((cmd) => {
              return {
                name: `\`${cmd.name}\``,
                value: cmd.description,
                inline: true,
              };
            })
          )
          .setColor(message.color)
          .setFooter({
            text: client.user.username,
            iconURL: client.user.displayAvatarURL({ dynamic: true }),
          })
          .setTimestamp();

        int.update({ embeds: [categoryEmbed] });
      });

      collector.on("end", () => {
        init.edit({
          content:
            "You ran out of time! Do `" + message.prefix + "help` again.",
          components: components(true),
        });
      });
    }
  },
};
