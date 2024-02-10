const { SlashCommandBuilder } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la commande /vars :', err);};
const config = require('../config.json');
const { readFile } = require('fs');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('vars')
		.setDescription('Affichage des variables'),
	async execute(interaction) {
		await readFile('./config-vars.json', 'utf8', (error, data) => {
			if (error) {
				console.log(error);
				return;
			}
			// vérfier les permissions avant affichage
			if (interaction.user.id === config.ownerId) {
				interaction.reply({
					content: `\`\`\`${data}\`\`\``,
					ephemeral: true,
				}).catch(errHandler);
			}
			else {
				interaction.reply({
					content: '❌ Vous n\'avez pas l\'autorisation d\'utiliser cette commande.',
					ephemeral: true,
				});
			}
		});
	},
};