const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la commande /concours :', err);};
const config = require('../config.json');
const varspath = '../config-vars.json';
let vars = require(varspath);

module.exports = {
	data: new SlashCommandBuilder()
		.setName('concours')
		.setDescription('Liens et informations sur notre concours.'),
	async execute(interaction) {
		// gérer le cache des variables
		delete require.cache[require.resolve(varspath)];
		vars = require(varspath);
		// embed d'information
		const embed = new EmbedBuilder()
			.setColor(config.Blue)
			.setTitle('Liens et informations sur les Murmures Littéraires')
			.setDescription(`${vars.news}
        \n\n [Page du concours]${config.website.concours}
		\n [Règlement]${config.website.reglement} | [Dates et récompenses]${config.website.modalites}
		\n [Catégories]${config.website.categories} | [Nos Partenaires]${config.website.partenaires} 
        \n\n[En savoir plus sur l'association]${config.website.association}
        \n${config.concours.dons}`)
			.setTimestamp();
		// envoi
		await interaction.reply({
			embeds: [embed],
		}).catch(errHandler);
	},
};