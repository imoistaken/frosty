import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { successEmbed } from '../../utils/embeds.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

const VOUCH_ROLE_ID = "1529257093234692096";

export default {
    data: new SlashCommandBuilder()
        .setName("vouch")
        .setDescription("Give a user the vouch role.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("User to vouch")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

    category: "community",

    // Prefix command: -vouch user @User
    async prefixExecute(interaction) {
        const args = interaction.options._positional;

        if (args.length < 2 || args[0].toLowerCase() !== "user") {
            return interaction.reply({
                content: "Usage: `-vouch user @User`",
            });
        }

        const mention = args[1];
        const id = mention.replace(/[<@!>]/g, "");

        const member = await interaction.guild.members.fetch(id).catch(() => null);

        if (!member) {
            return interaction.reply({
                content: "❌ User not found.",
            });
        }

        if (member.roles.cache.has(VOUCH_ROLE_ID)) {
            return interaction.reply({
                content: "❌ This user already has the Vouch role.",
            });
        }

        await member.roles.add(VOUCH_ROLE_ID);

        return interaction.reply({
            embeds: [
                successEmbed(
                    "✅ Vouch Given",
                    `${member.user.tag} has been given the Vouch role!`
                ),
            ],
        });
    },

    // Slash command: /vouch user:@User
    async execute(interaction) {
        const user = interaction.options.getUser("user");

        if (!user) {
            return InteractionHelper.universalReply(interaction, {
                content: "❌ User not found.",
                ephemeral: true,
            });
        }

        const member = await interaction.guild.members.fetch(user.id);

        if (member.roles.cache.has(VOUCH_ROLE_ID)) {
            return InteractionHelper.universalReply(interaction, {
                content: "❌ This user already has the Vouch role.",
                ephemeral: true,
            });
        }

        await member.roles.add(VOUCH_ROLE_ID);

        await InteractionHelper.universalReply(interaction, {
            embeds: [
                successEmbed(
                    "✅ Vouch Given",
                    `${user.tag} has been given the Vouch role!`
                ),
            ],
        });
    },
};
