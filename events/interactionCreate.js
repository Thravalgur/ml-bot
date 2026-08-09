const { MessageFlags } = require('discord.js');
const config = require('../config.json');

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
		const helpmessage = `\n Merci de contacter la modération ou de prévenir <@${config.ownerId}>.`
		if (interaction.isCommand()) {
			const command = client.commands.get(interaction.commandName);
			if (!command) return interaction.reply('Cette commande est invalide.');
			try {
				await command.execute(interaction, client, config);
			}
			catch (error) {
				console.error(error);
				return interaction.reply({
					content: `**ERREUR : la commande n'a pas été utilisée de la façon prévue ou ne fonctionne pas.**
					\n Merci de contacter `,
					flags: MessageFlags.Ephemeral,
				});
			}
		}
		else if (interaction.isButton()) {
			if (interaction.customId === 'ask-ml-ticket') {
				console.log('demande d\'un ticket reçue');
				const askTicket = require('../utils/askMLTicket.js');
				try {
					await askTicket.execute(interaction);
				}
				catch (error) {
					console.error(error);
					return interaction.reply({
						content: `**ERREUR : votre ouverture de discussion n'a pas pu être traitée.**\n Merci de contacter la modération dans <#${config.helpChannel}> ou de prévenir <@${config.ownerId}>.`,
						flags: MessageFlags.Ephemeral,
					});
				}
			}
			else if (interaction.customId === 'ask-threadticket') {
				console.log('demande d\'un ticket par fils reçue');
				const askThreadTicket = require('../utils/askThreadTicket.js');
				try {
					await askThreadTicket.execute(interaction);
				}
				catch (error) {
					console.error(error);
					return interaction.reply({
						content: `**ERREUR : votre ouverture de ticket n'a pas pu être traitée.**${helpmessage}`,
						flags: MessageFlags.Ephemeral,
					});
				}
			}
			else if (interaction.customId === 'ask-notif') {
				console.log('demande ou retrait du rôle Notifications');
				const askNotif = require('../utils/askNotif.js');
				try {
					await askNotif.execute(interaction);
				}
				catch (error) {
					console.error(error);
					return interaction.reply({
						content: `**ERREUR : votre demande du rôle Notifications n'a pas pu être traitée.**${helpmessage}`,
						flags: MessageFlags.Ephemeral,
					});
				}
			}
			else if (interaction.customId === 'ask-anim') {
				console.log('demande ou retrait du rôle Scriptorium');
				const askAnim = require('../utils/askAnim.js');
				try {
					await askAnim.execute(interaction);
				}
				catch (error) {
					console.error(error);
					return interaction.reply({
						content: `**ERREUR : votre demande du rôle Scriptorium n'a pas pu être traitée.*${helpmessage}`,
						flags: MessageFlags.Ephemeral,
					});
				}
			}
			else if (interaction.customId === 'ask-inscrit') {
				console.log('demande ou retrait du rôle Inscrit');
				const askInscrit = require('../utils/askInscrit.js');
				try {
					await askInscrit.execute(interaction);
				}
				catch (error) {
					console.error(error);
					return interaction.reply({
						content: `**ERREUR : votre demande du rôle d'Inscrit n'a pas pu être traitée.**${helpmessage}. Ne donnez le titre de votre roman qu'en message privé afin de ne pas rompre l'anonymat.`,
						flags: MessageFlags.Ephemeral,
					});
				}
			}
		}
		else if (interaction.isModalSubmit()) {
			if (interaction.customId === 'config-ml-ticket') {
				console.log('discussions : titre d\'un manuscrit participant reçu');
				const configTicket = require('../utils/configMLTicket.js');
				try {
					await configTicket.execute(interaction);
				}
				catch (error) {
					console.error(error);
					return interaction.reply({
						content: `**ERREUR : le titre que vous avez saisi n'a pas pu être traité.**\n Merci de contacter un modérateur dans <#${config.helpChannel}> ou de prévenir <@${config.ownerId}>.`,
						flags: MessageFlags.Ephemeral,
					});
				}
			}
			else if (interaction.customId === 'send-inscrit') {
				console.log('rôle : titre d\'un manuscrit inscrit reçu');
				const configTicket = require('../utils/sendInscrit.js');
				try {
					await configTicket.execute(interaction);
				}
				catch (error) {
					console.error(error);
					return interaction.reply({
						content: `**ERREUR : le titre que vous avez saisi n'a pas pu être traité.**\n Merci de contacter un modérateur dans <#${config.helpChannel}> ou de prévenir <@${config.ownerId}>.`,
						flags: MessageFlags.Ephemeral,
					});
				}
			}
		}
		else if (interaction.isStringSelectMenu()) {
			if (interaction.customId === 'select-category') {
				console.log('catégorie reçue');
				const moveTicket = require('../utils/moveTicket.js');
				try {
					await moveTicket.execute(interaction);
				}
				catch (error) {
					console.error(error);
					return interaction.reply({
						content: `**ERREUR : la catégorie que vous avez sélectionnée n'a pas pu être attribuée ou une erreur est survenue en cours de création du ticket.**\n Merci de contacter un modérateur dans <#${config.helpChannel}> ou de prévenir <@${config.ownerId}>.`,
						flags: MessageFlags.Ephemeral,
					});
				}
			}
		}
		else {return;}
	},
};