require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.GuildMessages
  ]
});

// In-memory per-user timers (replace with DB later if needed)
const timers = {};

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// Slash command: /dashboard
client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "dashboard") {
    const userId = interaction.user.id;
    const url = `https://the-fx148.github.io/Server-148-Timers/?user=${userId}`;

    await interaction.reply({
      content: `Here is your personal timer dashboard:\n${url}`,
      ephemeral: true
    });
  }

  if (interaction.commandName === "settimer") {
    const minutes = interaction.options.getInteger("minutes");
    const label = interaction.options.getString("label") || "Timer";

    const end = Date.now() + minutes * 60000;

    if (!timers[interaction.user.id]) timers[interaction.user.id] = [];
    timers[interaction.user.id].push({ label, end });

    await interaction.reply({
      content: `⏱ Timer set: **${label}** for ${minutes} minutes.`,
      ephemeral: true
    });
  }
});

// Timer loop
setInterval(() => {
  const now = Date.now();

  for (const userId in timers) {
    timers[userId] = timers[userId].filter(t => {
      if (t.end <= now) {
        client.users.fetch(userId).then(user => {
          user.send(`⏰ **${t.label}** is finished.`);
        });
        return false;
      }
      return true;
    });
  }
}, 1000);

client.login(process.env.DISCORD_TOKEN);
