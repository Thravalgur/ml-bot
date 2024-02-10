const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la commande /rs :', err);};
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rs')
		.setDescription('Liste les réseaux sociaux des ML.'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setColor(config.Blue)
			.setTitle('**Retrouvez les Murmures Littéraires sur les réseaux sociaux** :')
			.setDescription(`${config.concours.rs}\n\n${config.concours.newsletter}\n\n${config.concours.dons}`)
			.setTimestamp();
		await interaction.reply({
			embeds: [embed],
		}).catch(errHandler);
	},
};