async prefixExecute(interaction) {
    const args = interaction.options._positional;

    if (args.length !== 2 || args[0].toLowerCase() !== "give") {
        return interaction.reply({
            content: "Usage: `-vouch give @User`",
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
