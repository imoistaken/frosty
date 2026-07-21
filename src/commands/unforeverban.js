import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import { getForeverBanKey, deleteFromDb } from "../../database.js";

export default {
    data: new SlashCommandBuilder()
        .setName("unforeverban")
        .setDescription("Removes a forever ban from a user.")
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User to unban")
                .setRequired(true)
        ),

    async execute(interaction) {

        const user = interaction.options.getUser("user");

        try {

            // Remove from forever ban database
            await deleteFromDb(
                getForeverBanKey(user.id)
            );

            // Unban user from Discord
            await interaction.guild.members.unban(user.id);

            await interaction.reply({
                content:
                    `✅ **${user.tag} has been removed from the forever ban list and unbanned.**`
            });

        } catch (error) {

            console.error("Unforeverban error:", error);

            await interaction.reply({
                content:
                    "❌ I could not unban this user. They may not be banned.",
                ephemeral: true
            });

        }
    }
};
