import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";

export default {
  data: new SlashCommandBuilder()
    .setName("foreverban")
    .setDescription("Permanently bans a user from the server.")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("The user to permanently ban")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("reason")
        .setDescription("Reason for the forever ban")
        .setRequired(false)
    ),

  async execute(interaction) {
    const ownerIds = process.env.OWNER_IDS
      ?.split(",")
      .map(id => id.trim()) || [];

    // Only bot owners can use foreverban
    if (!ownerIds.includes(interaction.user.id)) {
      return interaction.reply({
        content: "❌ You do not have permission to use this command.",
        ephemeral: true,
      });
    }

    const user = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("reason") ||
      "No reason provided";

    try {
      // Ban the user from the server
      await interaction.guild.members.ban(user.id, {
        reason: `Forever Ban: ${reason}`,
      });

      await interaction.reply({
        content:
          `🔨 **Forever Ban Applied**\n\n` +
          `User: ${user.tag}\n` +
          `Reason: ${reason}\n\n` +
          `This user has been permanently banned.`,
        ephemeral: true,
      });

      console.log(
        `[FOREVER BAN] ${user.tag} (${user.id}) | Reason: ${reason}`
      );

    } catch (error) {
      console.error("Forever ban error:", error);

      await interaction.reply({
        content:
          "❌ I could not forever ban this user. Check my permissions.",
        ephemeral: true,
      });
    }
  },
};
