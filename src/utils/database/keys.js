/**
 * Canonical database key registry.
 * All storage keys should be built through these helpers.
 */

export function getGuildConfigKey(guildId) {
    return `guild:${guildId}:config`;
}

export const getGuildBirthdaysKey = (guildId) => `guild:${guildId}:config`;

export const getBirthdayLeftBackupKey = (guildId) => `guild:${guildId}:birthdays`;

export const getBirthdayTrackingKey = (guildId) => `guild:${guildId}:birthdays:left`;


export function getTicketKey(guildId, channelId) {
    return `guild:${guildId}:ticket:${channelId}`;
}

export function getTicketCounterKey(guildId) {
    return `guild:${guildId}:ticket:counter`;
}

export function getInviteTrackingKey(guildId) {
    return `guild:${guildId}:invites`;
}

export function getMemberInvitesKey(guildId, userId) {
    return `guild:${guildId}:invites:${userId}`;
}

export function getInviteUsesKey(guildId, inviteCode) {
    return `guild:${guildId}:invite_uses:${inviteCode}`;
}

export function getFakeAccountKey(guildId, userId) {
    return `guild:${guildId}:fake_account:${userId}`;
}

export function getEconomyKey(guildId, userId) {
    return `guild:${guildId}:economy:${userId}`;
}

export function getEconomyPrefix(guildId) {
    return `guild:${guildId}:economy:`;
}

export function getAFKKey(guildId, userId) {
    return `guild:${guildId}:afk:${userId}`;
}

export function getWelcomeConfigKey(guildId) {
    return `guild:${guildId}:welcome`;
}

export function getLevelingKey(guildId) {
    return `guild:${guildId}:leveling:config`;
}

export function getUserLevelKey(guildId, userId) {
    return `guild:${guildId}:leveling:users:${userId}`;
}

export function getUserLevelPrefix(guildId) {
    return `guild:${guildId}:leveling:users:`;
}

export function getApplicationRolesKey(guildId) {
    return `guild:${guildId}:applications:roles`;
}

export function getApplicationSettingsKey(guildId) {
    return `guild:${guildId}:applications:settings`;
}

export function getUserApplicationsKey(guildId, userId) {
    return `guild:${guildId}:applications:users:${userId}`;
}

export function getApplicationKey(guildId, applicationId) {
    return `guild:${guildId}:applications:${applicationId}`;
}

export function getApplicationsPrefix(guildId) {
    return `guild:${guildId}:applications:`;
}

export function getJoinToCreateConfigKey(guildId) {
    return `guild:${guildId}:jointocreate`;
}

export function getJoinToCreateChannelsKey(guildId) {
    return `guild:${guildId}:jointocreate:channels`;
}

export function getWarningsKey(guildId, userId) {
    return `guild:${guildId}:warnings:${userId}`;
}

export function getWarningsPrefix(guildId) {
    return `guild:${guildId}:warnings:`;
}

export function getUserNotesKey(guildId, userId) {
    return `guild:${guildId}:usernotes:${userId}`;
}

export function getUserNotesListKey(guildId) {
    return `guild:${guildId}:usernotes:list`;
}

export function getReactionRoleKey(guildId, messageId) {
    return `guild:${guildId}:reaction_roles:${messageId}`;
}

export function getReactionRolesPrefix(guildId) {
    return `guild:${guildId}:reaction_roles:`;
}

export function getServerCountersKey(guildId) {
    return `guild:${guildId}:counters`;
}

export function getGiveawayEntryKey(userId, giveawayId) {
    return `giveaway:${userId}:${giveawayId}`;
}

export function getGiveawayLockKey(messageId) {
    return `giveaway:lock:${messageId}`;
}


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
        skipIf: (guildId) => guildId === "guild",
    },
];


export function canonicalizeKey(key) {
    if (typeof key !== "string" || !key) {
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


export function getLegacyVariantsForCanonical(canonicalKey) {
    const variants = [];

    const economy = canonicalKey.match(/^guild:([^:]+):economy:([^:]+)$/);

    if (economy) {
        variants.push(`economy:${economy[1]}:${economy[2]}`);
    }

    const birthdays = canonicalKey.match(/^guild:([^:]+):config$/);

    if (birthdays) {
        variants.push(`birthdays:${birthdays[1]}`);
    }

    return variants;
}


export function getForeverBanKey(userId) {
    return `foreverban:${userId}`;
}


export function getVouchKey(userId) {
    return `vouches:${userId}`;
}

export function getVouchConfigKey(guildId) {
    return `guild:${guildId}:vouch:config`;
}
