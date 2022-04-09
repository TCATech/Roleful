const client = require("../index");
const keepAlive = require("../server");

client.on("ready", () => {
  setInterval(() => {
    const list = [
      "r!help",
      `${client.users.cache.size} users`,
      `${client.guilds.cache.size} servers`,
      `${client.channels.cache.size} channels`,
    ];
    const randomStatus = list[Math.floor(Math.random() * list.length)];
    let statusType = "WATCHING";
    if (randomStatus === "r!help") {
      statusType = "LISTENING";
    }

    client.user.setActivity(randomStatus, { type: statusType });
  }, 10000);

  console.log(`${client.user.tag} is now online!`);

  keepAlive();
});
