import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import db from "../../database/database.js"; // change this path if your database file is somewhere else

export default {
    data: new SlashCommandBuilder()
        .setName("foreverban")
        .setDescription("Permanently bans a user.")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User to forever ban")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the ban")
                .setRequired(false)
        ),

    async execute(interaction) {

        const user = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") || "No reason provided";

        try {

            // Save forever ban to database
            db.run(
                `INSERT OR REPLACE INTO foreverbans (user_id, banned_by, reason)
                 VALUES (?, ?, ?)`,
                [
                    user.id,
                    interaction.user.id,
                    reason
                ]
            );

            // Ban user
            await interaction.guild.members.ban(user.id, {
                reason: `Forever ban: ${reason}`
            });

            await interaction.reply({
                content:
                    `✅ **${user.tag} has been forever banned.**\n` +
                    `Reason: ${reason}\n` +
                    `Banned by: ${interaction.user.tag}`
            });

        } catch (error) {

            console.error(error);

            await interaction.reply({
                content: "❌ Failed to forever ban this user.",
                ephemeral: true
            });

        }
    }
};
