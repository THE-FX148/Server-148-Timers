require("dotenv").config();
const { REST, Routes } = require("discord.js");

const commands = [
  {
    name: "dashboard",
    description: "Get your personal timer dashboard link"
  },
  {
    name: "settimer",
    description: "Set a timer",
    options: [
      {
        name: "minutes",
        description: "Minutes until the timer ends",
        type: 4,
        required: true
      },
      {
        name: "label",
        description: "Name of the timer",
        type: 3,
        required: false
      }
    ]
  }
];

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log("Registering slash commands...");
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log("Commands registered.");
  } catch (err) {
    console.error(err);
  }
})();
