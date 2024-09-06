const { SlashCommandBuilder } = require('discord.js');
const toonsum = require("../../api/wowapi.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('toonsum')
		.setDescription('testing toon data from api'),
	async execute(interaction) {

        console.log(interaction);
        // for (i=0; i<interaction.args.length; i++){
        //     console.log(args[i]);
        // }
        // let toon = await toonsum.getCharacterEquipmentSummary("Icecrown", "Greenny");
        // toonsum.calculateIlvl(toon);
		await interaction.reply("maybe?");
	},
};