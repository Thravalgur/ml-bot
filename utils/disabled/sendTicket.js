const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const config = require('../config.json');
const errHandler = (err) => {console.error('ERREUR avec l\'envoi du bouton des tickets :', err);};

module.exports = {
	name: 'sendTicket',
	async execute(client) {
		const contactChan = client.channels.cache.find(channel => channel.id === config.ticketChannel);
		if (contactChan) {
			// embed et bouton
			const askembed = new EmbedBuilder()
				.setTitle('Demandes de contact automatiques')
				.setColor('68BBE3')
				.setDescription(`Cliquez sur le bouton  ci-dessous pour ouvrir une demande de discussion avec le jury (UNE seule discussion pour toute la durée du concours).
		      \nUne fois la demande ouverte, merci d'indiquer le **titre** (sans caractères spéciaux) et la **catégorie** (en tenant compte des re-catégorisations) de votre manuscrit.
		      \n\nATTENTION : le système de discussion est automatique. Les messages envoyés dans le salon de discussion sont retransmis immédiatement au jury, sans possibilité de suppression.`);
			const askrow = new ActionRowBuilder()
				.addComponents(
					new ButtonBuilder()
						.setCustomId('ask-ticket')
						.setLabel('Discuter de votre manuscrit')
						.setEmoji('✉️')
						.setStyle(ButtonStyle.Primary),
				);
			// Bulkdelete : supprime tous les messages précédents pourvu qu'ils ne soient pas trop anciens
			await contactChan.bulkDelete(10)
				.then(() => {
					contactChan.send({
						embeds: [askembed],
						components: [askrow],
					})
						.then(console.log('Bouton envoyé !'));
				}).catch(errHandler);
		}
		else {
			await console.log('ERREUR : le bouton d\'ouverture des tickets n\'a pas pu être envoyé, salon cible inexistant.');
		}
	},
};