/**
 * Canonical database key registry.
 * All storage keys should be built through these helpers.
 */

export const getGuildBirthdaysKey = (guildId) => `guild:${guildId}:config`;
export const getBirthdayLeftBackupKey = (guildId) => `guild:${guildId}:birthdays`;
export const getBirthdayTrackingKey = (guildId) => `guild:${guildId}:birthdays:left`;
export const LEGACY_KEY_RESOLVERS = (guildId) => `guild:${guildId}:birthdays:tracking`;

 function getTicketKey(guildId, channelId) {
    return `guild:${guildId}:ticket:${channelId}`;
}

 function getTicketCounterKey(guildId) {
    return `guild:${guildId}:ticket:counter`;
}

 function getInviteTrackingKey(guildId) {
    return `guild:${guildId}:invites`;
}

 function getMemberInvitesKey(guildId, userId) {
    return `guild:${guildId}:invites:${userId}`;
}

 function getInviteUsesKey(guildId, inviteCode) {
    return `guild:${guildId}:invite_uses:${inviteCode}`;
}

 function getFakeAccountKey(guildId, userId) {
    return `guild:${guildId}:fake_account:${userId}`;
}

 function getEconomyKey(guildId, userId) {
    return `guild:${guildId}:economy:${userId}`;
}

 function getEconomyPrefix(guildId) {
    return `guild:${guildId}:economy:`;
}

 function getAFKKey(guildId, userId) {
    return `guild:${guildId}:afk:${userId}`;
}

export function getWelcomeConfigKey(guildId) {
    return `guild:${guildId}:welcome`;
}

 function getLevelingKey(guildId) {
    return `guild:${guildId}:leveling:config`;
}

 function getUserLevelKey(guildId, userId) {
    return `guild:${guildId}:leveling:users:${userId}`;
}

 function getUserLevelPrefix(guildId) {
    return `guild:${guildId}:leveling:users:`;
}

 function getApplicationRolesKey(guildId) {
    return `guild:${guildId}:applications:roles`;
}

 function getApplicationSettingsKey(guildId) {
    return `guild:${guildId}:applications:settings`;
}

 function getUserApplicationsKey(guildId, userId) {
    return `guild:${guildId}:applications:users:${userId}`;
}

 function getApplicationKey(guildId, applicationId) {
    return `guild:${guildId}:applications:${applicationId}`;
}

 function getApplicationsPrefix(guildId) {
    return `guild:${guildId}:applications:`;
}

 function getJoinToCreateConfigKey(guildId) {
    return `guild:${guildId}:jointocreate`;
}

 function getJoinToCreateChannelsKey(guildId) {
    return `guild:${guildId}:jointocreate:channels`;
}

 function getWarningsKey(guildId, userId) {
    return `guild:${guildId}:warnings:${userId}`;
}

 function getWarningsPrefix(guildId) {
    return `guild:${guildId}:warnings:`;
}

 function getUserNotesKey(guildId, userId) {
    return `guild:${guildId}:usernotes:${userId}`;
}

 function getUserNotesListKey(guildId) {
    return `guild:${guildId}:usernotes:list`;
}

 function getReactionRoleKey(guildId, messageId) {
    return `guild:${guildId}:reaction_roles:${messageId}`;
}

 function getReactionRolesPrefix(guildId) {
    return `guild:${guildId}:reaction_roles:`;
}

 function getServerCountersKey(guildId) {
    return `guild:${guildId}:counters`;
}

 function getGiveawayEntryKey(userId, giveawayId) {
    return `giveaway:${userId}:${giveawayId}`;
}

 function getGiveawayLockKey(messageId) {
    return `giveaway:lock:${messageId}`;
}

/**
 * Legacy key patterns mapped to canonical builders.
 * Used by migration script and read-time fallback.
 */
export const LEGACY_KEY_RESOLVERS = [
    {
        pattern: /^economy:([^:]+):([^:]+)$/,
        toCanonical: ([, guildId, userId]) => getEconomyKey(guildId, userId),
    },
    {
        pattern: /^birthdays:([^:]+)$/,
        toCanonical: ([, guildId]) => getGuildBirthdaysKey(guildId),
    },
    {
        pattern: /^([^:]+):leveling:users:([^:]+)$/,
        toCanonical: ([, guildId, userId]) => getUserLevelKey(guildId, userId),
        skipIf: (guildId) => guildId === 'guild',
    },
    {
        pattern: /^moderation:warnings:([^:]+):([^:]+)$/,
        toCanonical: ([, guildId, userId]) => getWarningsKey(guildId, userId),
    },
    {
        pattern: /^moderation_user_notes_([^_]+)_([^_]+)$/,
        toCanonical: ([, guildId, userId]) => getUserNotesKey(guildId, userId),
    },
    {
        pattern: /^moderation_user_notes_list_([^_]+)$/,
        toCanonical: ([, guildId]) => getUserNotesListKey(guildId),
    },
    {
        pattern: /^reaction_roles:([^:]+):([^:]+)$/,
        toCanonical: ([, guildId, messageId]) => getReactionRoleKey(guildId, messageId),
    },
    {
        pattern: /^counters:([^:]+)$/,
        toCanonical: ([, guildId]) => getServerCountersKey(guildId),
    },
    {
        pattern: /^bday-role-tracking-([^:]+)$/,
        toCanonical: ([, guildId]) => getBirthdayTrackingKey(guildId),
    },
];

/**
 * Returns the canonical key for a legacy or already-canonical key.
 */
 function canonicalizeKey(key) {
    if (typeof key !== 'string' || !key) {
        return key;
    }

    for (const { pattern, toCanonical, skipIf } of LEGACY_KEY_RESOLVERS) {
        const match = key.match(pattern);
        if (!match) continue;
        if (skipIf?.(match[1])) continue;
        return toCanonical(match);
    }

    return key;
}

/**
 * Returns legacy key variants that may still hold data for a canonical key.
 */
 function getLegacyVariantsForCanonical(canonicalKey) {
    const variants = [];

    for (const { pattern, toCanonical } of LEGACY_KEY_RESOLVERS) {
        const sample = canonicalKey;
        const match = sample.match(/^guild:([^:]+):economy:([^:]+)$/);
        if (match && toCanonical(['', match[1], match[2]]) === canonicalKey) {
            variants.push(`economy:${match[1]}:${match[2]}`);
            continue;
        }

        const birthdaysMatch = sample.match(/^guild:([^:]+):birthdays$/);
        if (birthdaysMatch && toCanonical(['', birthdaysMatch[1]]) === canonicalKey) {
            variants.push(`birthdays:${birthdaysMatch[1]}`);
            continue;
        }

        const levelMatch = sample.match(/^guild:([^:]+):leveling:users:([^:]+)$/);
        if (levelMatch && toCanonical(['', levelMatch[1], levelMatch[2]]) === canonicalKey) {
            variants.push(`${levelMatch[1]}:leveling:users:${levelMatch[2]}`);
            continue;
        }

        const warningsMatch = sample.match(/^guild:([^:]+):warnings:([^:]+)$/);
        if (warningsMatch && toCanonical(['', warningsMatch[1], warningsMatch[2]]) === canonicalKey) {
            variants.push(`moderation:warnings:${warningsMatch[1]}:${warningsMatch[2]}`);
            continue;
        }

        const notesMatch = sample.match(/^guild:([^:]+):usernotes:([^:]+)$/);
        if (notesMatch && toCanonical(['', notesMatch[1], notesMatch[2]]) === canonicalKey) {
            variants.push(`moderation_user_notes_${notesMatch[1]}_${notesMatch[2]}`);
            continue;
        }

        const notesListMatch = sample.match(/^guild:([^:]+):usernotes:list$/);
        if (notesListMatch && toCanonical(['', notesListMatch[1]]) === canonicalKey) {
            variants.push(`moderation_user_notes_list_${notesListMatch[1]}`);
            continue;
        }

        const reactionMatch = sample.match(/^guild:([^:]+):reaction_roles:([^:]+)$/);
        if (reactionMatch && toCanonical(['', reactionMatch[1], reactionMatch[2]]) === canonicalKey) {
            variants.push(`reaction_roles:${reactionMatch[1]}:${reactionMatch[2]}`);
            continue;
        }

        const countersMatch = sample.match(/^guild:([^:]+):counters$/);
        if (countersMatch && toCanonical(['', countersMatch[1]]) === canonicalKey) {
            variants.push(`counters:${countersMatch[1]}`);
            continue;
        }

        const trackingMatch = sample.match(/^guild:([^:]+):birthdays:tracking$/);
        if (trackingMatch && toCanonical(['', trackingMatch[1]]) === canonicalKey) {
            variants.push(`bday-role-tracking-${trackingMatch[1]}`);
        }
return variants;
}

function getForeverBanKey(userId) {
    return `foreverban:${userId}`;
}

function getForeverBanKey(userId) {
    return `foreverban:${userId}`;
}

module.exports = {
    getGuildConfigKey,
    getWarningsKey,
    getForeverBanKey
};
module.exports = {
    getGuildConfigKey,
    getGuildBirthdaysKey,
    getBirthdayLeftBackupKey,
    getBirthdayTrackingKey,
    getTicketKey,
    getTicketCounterKey,
    getInviteTrackingKey,
    getMemberInvitesKey,
    getInviteUsesKey,
    getFakeAccountKey,
    getEconomyKey,
    getEconomyPrefix,
    getAFKKey,
    getWelcomeConfigKey,
    getLevelingKey,
    getUserLevelKey,
    getUserLevelPrefix,
    getApplicationRolesKey,
    getApplicationSettingsKey,
    getUserApplicationsKey,
    getApplicationKey,
    getApplicationsPrefix,
    getJoinToCreateConfigKey,
    getJoinToCreateChannelsKey,
    getWarningsKey,
    getWarningsPrefix,
    getUserNotesKey,
    getUserNotesListKey,
    getReactionRoleKey,
    getReactionRolesPrefix,
    getServerCountersKey,
    getGiveawayEntryKey,
    getGiveawayLockKey,
    LEGACY_KEY_RESOLVERS,
    canonicalizeKey,
    getLegacyVariantsForCanonical,
    getForeverBanKey
};
