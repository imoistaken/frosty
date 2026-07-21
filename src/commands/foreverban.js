import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { getForeverBanKey, setInDb } from "../../database.js";

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

            // Save forever ban in database
            await setInDb(
                getForeverBanKey(user.id),
                {
                    userId: user.id,
                    bannedBy: interaction.user.id,
                    reason: reason,
                    date: Date.now()
                }
            );

            // Ban the user
            await interaction.guild.members.ban(user.id, {
                reason: `Forever ban: ${reason}`
            });

            await interaction.reply({
                content:
                    `✅ **${user.tag} has been forever banned.**\n\n` +
                    `**Reason:** ${reason}\n` +
                    `**Banned by:** ${interaction.user.tag}`
            });

        } catch (error) {

            console.error("Forever ban error:", error);

            await interaction.reply({
                content: "❌ I could not forever ban this user.",
                ephemeral: true
            });

        }
    }
};
