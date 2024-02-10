const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la commande /roles :', err);};
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('threadtickets')
		.setDescription('Envoyer le panneau de demande de ticket')
		.addStringOption(option =>
			option.setName('label')
				.setDescription('Texte sur le bouton (court)')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('title')
				.setDescription('Titre du message embed')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('text')
				.setDescription('Texte de description supplémentaire sur le message embed')
				.setRequired(false)),

	async execute(interaction) {
		// récupérer les données
		const label = interaction.options.getString('label');
		const title = interaction.options.getString('title');
		const text = interaction.options.getString('text');
		// embed et bouton
		const askembed = new EmbedBuilder()
			.setTitle(title)
			.setColor(config.Blue)
			.setDescription(`${text}
            \n\n Cliquez sur le bouton  ci-dessous pour ouvrir un ticket ! Expliquez votre demande de façon claire en mentionnant à qui vous l'adressez.
			`);
		const askrow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('ask-threadticket')
					.setLabel(label)
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
				content: 'Le panneau des tickets par fils privés a bien été envoyé',
				ephemeral: true,
			}).catch(errHandler)
				.then(console.log('Bouton des tickets par fils privés envoyé !'));
		}
		else {
			interaction.reply({
				content: '❌ Vous n\'avez pas l\'autorisation d\'utiliser cette commande.',
				ephemeral: true,
			});
		}
	},
};