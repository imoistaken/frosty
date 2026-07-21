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

    async execute(interaction) {
        const user = interaction.options.getUser("user");
        const member = await interaction.guild.members.fetch(user.id);

        if (member.roles.cache.has("1528690394727055441")) {
            return InteractionHelper.universalReply(interaction, {
                content: "❌ This user already has the vouch role.",
                ephemeral: true,
            });
        }

        await member.roles.add(VOUCH_ROLE_ID);

        await InteractionHelper.universalReply(interaction, {
            embeds: [
                successEmbed(
                    "✅ Vouch Given",
                    `${user.tag} has been given the vouch role!`
                ),
            ],
        });
    },
};
