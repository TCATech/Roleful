const client = require("../index");
const keepAlive = require("../server");

client.on("ready", () => {
  setInterval(() => {
    const list = [
      "r!help | Roleful.tk",
      `${client.users.cache.size} users | Roleful.tk`,
      `${client.guilds.cache.size} servers | Roleful.tk`,
      `${client.channels.cache.size} channels | Roleful.tk`,
    ];
    const randomStatus = list[Math.floor(Math.random() * list.length)];
    let statusType = "WATCHING";
    if (randomStatus === "r!help | Roleful.tk") {
      statusType = "LISTENING";
    }

    client.user.setActivity(randomStatus, { type: statusType });
  }, 10000);

  console.log(`${client.user.tag} is now online!`);

  keepAlive();
});
