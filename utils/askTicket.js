const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la demande de titre :', err);};
const config = require('../config.json');

module.exports = {
	name: 'askTicket',
	async execute(interaction) {
		const banrole = config.banRole;
		const member = interaction.member;
		// créer l'embed pour ticket déjà créé
		const noembed = new EmbedBuilder()
			.setColor(config.Blue)
			.setTitle('Ticket déjà ouvert')
			.setDescription('***Vous avez déjà ouvert une discussion sur votre manuscrit ! Vous pouvez continuer à l\'utiliser pour communiquer avec le jury.***')
			.setTimestamp();
		// créer un formulaire pour demander le titre
		const modaltitle = new ModalBuilder()
			.setCustomId('config-ticket')
			.setTitle('Ouverture de la discussion');
		// créer un champ dans le formulaire pour indiquer le titre
		const titleInput = new TextInputBuilder ()
			.setCustomId('titleInput')
			.setLabel('Quel est le titre de votre manuscrit ?')
			.setStyle(TextInputStyle.Short)
			.setMaxLength(1000)
			.setMinLength(3)
			.setPlaceholder('Titre du manuscrit')
			.setRequired(true);
		// rentrer la question dans un ActionRow
		const titleActionRow = new ActionRowBuilder().addComponents(titleInput);
		// ajouter l'ActionRow de la question dans le formulaire (modal)
		modaltitle.addComponents(titleActionRow);
		if (member.roles.cache.some(role => role.id === banrole)) {
			// refuser l'envoi d'un autre ticket
			await interaction.reply({
				embeds: [noembed],
				ephemeral: true,
			}).catch(errHandler);
		}
		else {
			// afficher le formulaire (modal)
			await interaction.showModal(modaltitle).catch(errHandler);
		}
	},
};