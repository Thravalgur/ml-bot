const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la commande /roles :', err);};
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('roles')
		.setDescription('Envoyer le panneau de sélection des rôles'),
	async execute(interaction) {
		// embed du panneau
		const roleembed = new EmbedBuilder()
			.setTitle('Rôles supplémentaires')
			.setColor(config.Blue)
			.setDescription(`
			**Vous pouvez prendre des rôles spéciaux sur le serveur, afin d'avoir accès à des fonctionnalités supplémentaires ou des salons de discussion spéciaux.**\n\n
			*Pour prendre le rôle concerné, il suffit d'utiliser les boutons en dessous du message ! Vous pouvez en prendre plusieurs en même temps, en fonction de ce qui vous intéresse. Vous pouvez aussi vous retirer le(s) rôle(s) que vous avez déjà en appuyant de nouveau sur le(s) bouton(s) correspondant(s).*
			\n\n
			`)
			.addFields(
				{
					name:'Animations',
					value:`
					:scroll:  Si nos animations vous intéressent, le rôle <@&${config.animRole}> vous permettra d'être notifié des jeux littéraires, défis et autres activités que notre équipe organisera !
					`,
				},
				{
					name:'Notifications',
					value:`
					:newspaper:  Si vous souhaitez être notifié pour les annonces éventuelles relatives à nos gagnants et/ou nos partenaires (sortie de roman, promotions qur le catalogue des ME, etc.), le rôle <@&${config.notifRole}> est fait pour vous ! 
					`,
				},
				{
					name:'Concours 2024',
					value:`
					:book:  Si vous avez inscrit un manuscrit à la cinquième édtion des Murmures Littéraires, vous pouvez accéder à l'espace réservé aux <@&${config.inscritRole}> où vous pourrez discuter avec les autres inscrits !
					`,
				},
			);
		// boutons liés
		const rolerow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('ask-anim')
					.setLabel('Scriptorium')
					.setEmoji('📜')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('ask-notif')
					.setLabel('Notifications')
					.setEmoji('📰')
					.setStyle(ButtonStyle.Success),
				new ButtonBuilder()
					.setCustomId('ask-inscrit')
					.setLabel('Inscrit au concours')
					.setEmoji('📖')
					.setStyle(ButtonStyle.Primary),
			);
		// vérification des permissions avant l'envoi
		if (interaction.user.id === config.ownerId) {
			await interaction.channel.send({
				embeds: [roleembed],
				components: [rolerow],
			});
			await interaction.reply({
				content: 'Le panneau a bien été envoyé',
				ephemeral: true,
			}).catch(errHandler)
				.then(console.log('Boutons des rôles envoyés !'));
		}
		else {
			await interaction.reply({
				content: '❌ Vous n\'avez pas l\'autorisation d\'utiliser cette commande.',
				ephemeral: true,
			});
		}
	},
};