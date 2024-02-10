const { SlashCommandBuilder } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la commande /varsedit :', err);};
const config = require('../config.json');
const { readFile, writeFile } = require('fs');
const varspath = './config-vars.json';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('varsedit')
		.setDescription('Modification des variables')
		.addStringOption(option =>
			option.setName('variable')
				.setDescription('Nom de la variable')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('contenu')
				.setDescription('Contenu de la variable')
				.setRequired(true)),
	async execute(interaction) {
		const variable = interaction.options.getString('variable');
		const rawcontent = interaction.options.getString('contenu');
		// check permissions
		if (interaction.user.id === config.ownerId) {
			await readFile(varspath, (error, data) => {
				if (error) {
					console.log(error);
					return;
				}
				const parsedData = JSON.parse(data);
				const content = rawcontent.replace(/\\\\/g, '\\');
				parsedData[variable] = `${content}`;
				writeFile(varspath, JSON.stringify(parsedData, null, 2).replace(/\\\\/g, '\\'), (err) => {
					if (err) {
						console.log(`La variable ${variable} n'a pas pu être éditée`, err);
						interaction.reply({
							content: `La variable ${variable} n'a pas pu être éditée \n ${err}`,
							ephemeral: true,
						});
					}
					console.log(`La variable ${variable} a été éditée avec succès !`);
					interaction.reply({
						content: `La variable ${variable} a été éditée avec succès !\n Son contenu est : ${content}`,
						ephemeral: true,
					});
				});
			});
		}
		else {
			await interaction.reply({
				content: '❌ Vous n\'avez pas l\'autorisation d\'utiliser cette commande.',
				ephemeral: true,
			});
		}
	},
};