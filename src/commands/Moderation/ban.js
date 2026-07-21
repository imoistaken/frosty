import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

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

        const member = await interaction.guild.members.fetch(user.id);

        await member.ban({
            reason: `Forever ban: ${reason}`
        });

        await interaction.reply({
            content: `✅ ${user.tag} has been permanently banned.\nReason: ${reason}`
        });
    }
};
