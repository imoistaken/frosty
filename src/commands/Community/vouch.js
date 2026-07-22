import {
    getVouchKey,
    getVouchConfigKey
} from "../../utils/database/keys.js";


export default {

    name: "vouch",
    description: "Vouch system",

    async execute(message, args, client) {

        const db = client.database;


        if (!args[0]) {
            return message.reply(
                "Usage: `-vouch give @user`, `-vouch take @user`, `-vouch list`"
            );
        }


        const action = args[0].toLowerCase();


        // GIVE VOUCH
        if (action === "give") {

            const user = message.mentions.users.first();

            if (!user)
                return message.reply("Mention someone to vouch.");


            let data =
                await db.get(getVouchKey(user.id))
                || {
                    count:0,
                    users:[]
                };


            if(data.users.includes(message.author.id))
                return message.reply(
                    "You already vouched this person."
                );


            data.count++;
            data.users.push(message.author.id);


            await db.set(
                getVouchKey(user.id),
                data
            );


            message.reply(
                `✅ ${message.author} vouched ${user}`
            );

        }



        // TAKE VOUCH
        if(action === "take") {

            const user = message.mentions.users.first();

            if(!user)
                return message.reply(
                    "Mention someone."
                );


            let data =
            await db.get(getVouchKey(user.id));


            if(!data)
                return message.reply(
                    "That user has no vouches."
                );


            data.count--;

            data.users =
            data.users.filter(
                id => id !== message.author.id
            );


            await db.set(
                getVouchKey(user.id),
                data
            );


            message.reply(
                `❌ Removed your vouch from ${user}`
            );

        }




        // LIST
        if(action === "list") {


            const config =
            await db.get(
                getVouchConfigKey(message.guild.id)
            );


            const role =
            config?.role
            ?
            `<@&${config.role}>`
            :
            "Not set";


            message.channel.send(
`
**Vouch System**

⭐ Vouch Role: ${role}

Use:
\`-vouch give @user\`
\`-vouch take @user\`
`
            );

        }



        // ROLE SET / DELETE

        if(action === "role") {


            if(!message.member.permissions.has("Administrator"))
                return message.reply(
                    "Admin only."
                );


            const option=args[1];


            if(option==="set") {

                const role =
                message.mentions.roles.first();


                if(!role)
                    return message.reply(
                        "Mention a role."
                    );


                await db.set(
                    getVouchConfigKey(message.guild.id),
                    {
                        role:role.id
                    }
                );


                message.reply(
                    `✅ Vouch role set to ${role}`
                );

            }



            if(option==="delete") {

                await db.delete(
                    getVouchConfigKey(message.guild.id)
                );


                message.reply(
                    "✅ Vouch role deleted."
                );

            }

        }

    }
};
