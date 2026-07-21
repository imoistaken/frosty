const { REST, Routes } = require("discord.js");

const token = "YOUR_BOT_TOKEN";
const clientId = "YOUR_CLIENT_ID";

const rest = new REST({ version: "10" }).setToken(token);

(async () => {
    try {
        console.log("Removing all slash commands...");

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: [] }
        );

        console.log("All slash commands removed!");
    } catch (error) {
        console.error(error);
    }
})();
