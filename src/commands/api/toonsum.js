const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyles, ButtonTypes, EmbedBuilder } = require('discord.js');
const gearsum = require("../../api/player/gearSummary.js");
const toonsum = require("../../api/player/toonSummary.js");
const toonilvl = require("../../api/player/getiLvl.js");
const serverStatus = require("../../api/server/status.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('toonsum')
		.setDescription('testing toon data from api')
        .addStringOption(option => 
            option.setName('server')
                .setDescription('Server Name')
                .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('name')
                .setDescription('Toon Name')
                .setRequired(true)
        ),
	async execute(interaction) {
        const author = interaction.user.username;
        //need input validation
        let status = await serverStatus.serverStatus(interaction.options.getString('server'));        
        if(status == "UP" || status == "DOWN"){
            const gearSum = await gearsum.getCharacterEquipmentSummary(interaction.options.getString('server'), interaction.options.getString('name'));
            const toonSum = await toonsum.getToonSummary(interaction.options.getString('server'), interaction.options.getString('name'));
            const gearFields = [];
            let currentPage = 0;
            if(!(typeof(gearSum) === "string")){
                let ilvl = await toonilvl.calculateIlvl(gearSum);
                const pages = [
                    {
                        title: `${interaction.options.getString('name')} (${String(ilvl)})`,
                        description: `Level ${toonSum.level}`,
                        fields: [
                            { name: toonSum.classAndSpec, value: `(${toonSum.gender} ${toonSum.race})`, inline: false},
                            { name: toonSum.guild, value: `(${toonSum.faction})`, inline: false},
                            { name: '\u200B', value: '\u200B' },
                            { name: "Warcraft Logs", value: `[${interaction.options.getString('name')}'s Logs](https://www.warcraftlogs.com/character/us/${interaction.options.getString('server')}/${interaction.options.getString('name')})`, inline: false},
                            { name: "Raider.io", value: `[${interaction.options.getString('name')}'s io](https://raider.io/characters/us/${interaction.options.getString('server')}/${interaction.options.getString('name')})`, inline: false}
                        ],
                        footer: { 
                            text: `Page (1/2) Use ◀️▶️ to navigate pages`,
                        }

                    },
                    {
                        title: `${interaction.options.getString('name')} (${String(ilvl)})`,
                        description: `Gear Summary`,
                        fields: gearFields,
                        footer: { 
                            text: `Page (2/2) Use ◀️▶️ to navigate pages`,
                        }
                    }

                ];
                
                console.log(`Generating toon sum: ${interaction.options.getString('name')}... Requester: ${interaction.user.globalName}`);
                
                for (i=0; i < gearSum.length; i++){
                    if(!(gearSum[i].type == "Shirt" || gearSum[i].type == "Tabard")){
                        gearFields.push({ name: `${gearSum[i].type}:`, value: `${gearSum[i].name}: (${String(gearSum[i].level)})`, inline: true});
                    }
                    
                }
                
                const buttons = [
                    new ButtonBuilder()
                      .setCustomId("previous")
                      .setLabel("◀️ Back")
                      .setStyle(1),
                    new ButtonBuilder()
                      .setCustomId("next")
                      .setLabel("▶️ Next")
                      .setStyle(1),
                ];

                const actionRow = new ActionRowBuilder()
                    .addComponents(buttons);

                const message = await interaction.reply({
                    embeds: [pages[currentPage]],
                    components: [actionRow],
                });

                const collector = message.createMessageComponentCollector({
                    componentType: 2,
                    time: 500000, // 5 minutes
                  });
                
                collector.on("collect", async (interaction) => {
                    if (interaction.customId === "previous" || interaction.customId === "next" && interaction.user.username === author) {
                        currentPage += interaction.customId === 'next' ? 1 : -1;
                        currentPage = Math.max(0, Math.min(pages.length - 1, currentPage));
                    };
                    await interaction.update({
                        embeds: [pages[currentPage]],
                        components: [actionRow],

                    })
                });
            

                //await interaction.reply(`${interaction.options.getString('name')}'s Ilvl is: ${ilvl}`);
            }
            else{
                console.log(`Failed generating summary of ${interaction.options.getString('name')}: ${gearSum}... Requester: ${interaction.user.globalName}`);
                await interaction.reply(`Something went wrong searching for ${interaction.options.getString('name')}... ${gearSum}`);
            }
        }
        else{
            console.log(`Failed generating fetching ${interaction.options.getString('server')} status: ${status}... Requester: ${interaction.user.globalName}`);
            await interaction.reply(`Something went wrong searching for ${interaction.options.getString('server')}... ${status}`);
        }

        
	},
};