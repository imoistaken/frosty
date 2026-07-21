async prefixExecute(message, args) {
    if (!args || args.length !== 2 || args[0].toLowerCase() !== "give") {
        return message.reply({
            content: "Usage: `-vouch give @User`",
        });
    }

    const mention = args[1];
    const id = mention.replace(/[<@!>]/g, "");

    const member = await message.guild.members.fetch(id).catch(() => null);

    if (!member) {
        return message.reply({
            content: "❌ User not found.",
        });
    }

    if (member.roles.cache.has(VOUCH_ROLE_ID)) {
        return message.reply({
            content: "❌ This user already has the Vouch role.",
        });
    }

    await member.roles.add(VOUCH_ROLE_ID);

    return message.reply({
        embeds: [
            successEmbed(
                "✅ Vouch Given",
                `${member.user.tag} has been given the Vouch role!`
            ),
        ],
    });
},
