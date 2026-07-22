import { SlashCommandBuilder, PermissionFlagsBits } from "discord.js";
import {
    getVouchKey,
    getVouchConfigKey
} from "../../utils/database/keys.js";


export default {

    data: new SlashCommandBuilder()
        .setName("vouch")
        .setDescription("Vouch system")

        .addSubcommand(sub =>
            sub
                .setName("give")
                .setDescription("Give someone a vouch")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("User to vouch")
                        .setRequired(true)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("take")
                .setDescription("Remove your vouch")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("User to remove vouch from")
                        .setRequired(true)
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("list")
                .setDescription("View vouches")
        )

        .addSubcommand(sub =>
            sub
                .setName("role")
                .setDescription("Manage vouch role")
                .addStringOption(option =>
                    option
                        .setName("action")
                        .setDescription("set or delete")
                        .setRequired(true)
                        .addChoices(
                            {
                                name:"Set",
                                value:"set"
                            },
                            {
                                name:"Delete",
                                value:"delete"
                            }
                        )
                )
                .addRoleOption(option =>
                    option
                        .setName("role")
                        .setDescription("Role to give for vouches")
                        .setRequired(false)
                )
        ),


    async execute(interaction) {


        const db = interaction.client.database;

        const sub =
            interaction.options.getSubcommand();



        if(sub === "give") {

            const user =
                interaction.options.getUser("user");


            let data =
                await db.get(getVouchKey(user.id))
                ||
                {
                    count:0,
                    users:[]
                };


            if(data.users.includes(interaction.user.id)) {

                return interaction.reply({
                    content:"❌ You already vouched this user.",
                    ephemeral:true
                });

            }


            data.count++;
            data.users.push(interaction.user.id);


            await db.set(
                getVouchKey(user.id),
                data
            );


            return interaction.reply(
                `✅ ${interaction.user} vouched ${user}`
            );

        }




        if(sub === "take") {

            const user =
                interaction.options.getUser("user");


            let data =
                await db.get(getVouchKey(user.id));


            if(!data) {

                return interaction.reply({
                    content:"❌ This user has no vouches.",
                    ephemeral:true
                });

            }


            data.users =
                data.users.filter(
                    id => id !== interaction.user.id
                );


            data.count = data.users.length;


            await db.set(
                getVouchKey(user.id),
                data
            );


            return interaction.reply(
                `❌ Removed your vouch from ${user}`
            );

        }




        if(sub === "list") {


            const config =
                await db.get(
                    getVouchConfigKey(
                        interaction.guild.id
                    )
                );


            const role =
                config?.role
                ?
                `<@&${config.role}>`
                :
                "Not set";


            return interaction.reply(
`
**⭐ Vouch System**

Vouch Role: ${role}

Use:
\`/vouch give\`
\`/vouch take\`
`
            );

        }




        if(sub === "role") {


            if(
                !interaction.member.permissions.has(
                    PermissionFlagsBits.Administrator
                )
            ) {

                return interaction.reply({
                    content:"❌ Admin only.",
                    ephemeral:true
                });

            }


            const action =
                interaction.options.getString("action");



            if(action === "set") {

                const role =
                    interaction.options.getRole("role");


                if(!role)
                    return interaction.reply({
                        content:"Mention a role.",
                        ephemeral:true
                    });


                await db.set(
                    getVouchConfigKey(
                        interaction.guild.id
                    ),
                    {
                        role:role.id
                    }
                );


                return interaction.reply(
                    `✅ Vouch role set to ${role}`
                );

            }



            if(action === "delete") {


                await db.delete(
                    getVouchConfigKey(
                        interaction.guild.id
                    )
                );


                return interaction.reply(
                    "✅ Vouch role deleted."
                );

            }

        }

    }
};
