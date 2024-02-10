const { EmbedBuilder, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la demande du rôle Inscrit :', err);};
const config = require('../config.json');

module.exports = {
	name: 'askInscrit',
	async execute(interaction) {
		const inscritrole = config.inscritRole;
		const member = interaction.member;
		// créer l'embed pour rôle déjà obtenu
		const noembed = new EmbedBuilder()
			.setColor(config.Blue)
			.setTitle('Rôle déjà obtenu')
			.setDescription(`***Vous avez déjà le rôle <@&${inscritrole}> !***`)
			.setTimestamp();
		// créer un formulaire pour demander le titre
		const modaltitle = new ModalBuilder()
			.setCustomId('send-inscrit')
			.setTitle('Quel manuscrit avez-vous inscrit aux ML 5 ?');
		// créer un champ dans le formulaire pour indiquer le titre
		const titleInput = new TextInputBuilder ()
			.setCustomId('titleInput')
			.setLabel('Titre et catégorie d\'inscription')
			.setStyle(TextInputStyle.Short)
			.setMaxLength(2000)
			.setMinLength(3)
			.setPlaceholder('Titre du manuscrit (Catégorie)')
			.setRequired(true);
		// rentrer la question dans un ActionRow
		const titleActionRow = new ActionRowBuilder().addComponents(titleInput);
		// ajouter l'ActionRow de la question dans le formulaire (modal)
		modaltitle.addComponents(titleActionRow);
		// afficher l'embed pour le rôle déjà obtenu
		if (member.roles.cache.some(role => role.id === inscritrole)) {
			interaction.reply({
				embeds: [noembed],
				ephemeral: true,
			}).catch(errHandler);
		}
		// afficher le formulaire (modal) si absence du rôle
		else {
			interaction.showModal(modaltitle).catch(errHandler);
		}
	},
};