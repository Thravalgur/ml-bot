const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la commande /roles :', err);};
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('tickets')
		.setDescription('Envoyer le panneau de demande de ticket'),
	async execute(interaction) {
		// embed et bouton
		const askembed = new EmbedBuilder()
			.setTitle('Demande de discussions avec le jury')
			.setColor(config.Blue)
			.setDescription(`Cliquez sur le bouton  ci-dessous pour ouvrir une demande de discussion avec les membres du jury qui ont lu votre manuscrit (UNE seule discussion pour toute la durée du concours).
			\n La discussion avec le jury doit respecter les règles d'anonymat fixées dans le règlement du concours. 
		    \nUne fois la demande ouverte, merci d'indiquer le **titre** (sans caractères spéciaux) et la **catégorie** (en tenant compte des re-catégorisations) de votre manuscrit.
			\n\nATTENTION : le système de discussion est automatique. Les messages envoyés dans le salon de discussion sont retransmis immédiatement au jury, sans possibilité de suppression.
			\n\n Si ce n'était pas déjà le cas, vous obtiendrez aussi l'accès à l'espace réservé aux <@&${config.inscritRole}>, où vous pourrez discuter avec les autres inscrits.
			`);
		const askrow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('ask-ticket')
					.setLabel('Discuter de votre manuscrit')
					.setEmoji('✉️')
					.setStyle(ButtonStyle.Primary),
			);
		// vérification des permissions avant l'envoi
		if (interaction.user.id === config.ownerId) {
			interaction.channel.send({
				embeds: [askembed],
				components: [askrow],
			});
			await interaction.reply({
				content: 'Le panneau des tickets a bien été envoyé',
				ephemeral: true,
			}).catch(errHandler)
				.then(console.log('Bouton des tickets envoyé !'));
		}
		else {
			interaction.reply({
				content: '❌ Vous n\'avez pas l\'autorisation d\'utiliser cette commande.',
				ephemeral: true,
			});
		}
	},
};