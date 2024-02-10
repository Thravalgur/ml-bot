const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la commande /say :', err);};
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('say')
		.setDescription('Envoyer un message')
		.addStringOption(option =>
			option.setName('destination')
				.setDescription('Destination du message')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('juge')
				.setDescription('Votre nom de juge (1 ou 2 / A, B, C ou D)')
				.setRequired(true)
				.addChoices(
					{ name: '1 (étape 1)', value: '1' },
					{ name: '2 (étape 1)', value: '2' },
					{ name: 'A (étape 2)', value: 'a' },
					{ name: 'B (étape 2)', value: 'b' },
					{ name: 'C (étape 2)', value: 'c' },
					{ name: 'D (étape 2)', value: 'd' },
					{ name: 'Organisation', value: 'ml' },
				))
		.addStringOption(option =>
			option.setName('texte')
				.setDescription('Texte du message à transmettre')
				.setRequired(true))
		.addAttachmentOption(option =>
			option.setName('fichier')
				.setRequired(false)
				.setDescription('Ajout facultatif de fichier (image, document, etc.) à envoyer avec votre message'),
		),
	async execute(interaction) {
		// vérification des permissions
		const serverID = interaction.guild.id;
		if (serverID === config.hubGuild) {
			// préparation des données pour l'embed
			const destination = interaction.options.getString('destination').trim();
			const text = interaction.options.getString('texte');
			// vérifier s'il y a un fichier joint et l'envoyer si besoin
			const files = [];
			const file = interaction.options.getAttachment('fichier');
			if (file) files.push(file.url);
			// créer la boucle pour changer la couleur et l'url en fonction de l'auteur
			const Juge = config.Juge.find((x) => x.id === interaction.options.getString('juge'));
			// prendre en charge les retours à la ligne
			const textmsg = text.replace(/\\\\/g, '\\');
			// embed du message envoyé
			const msgembed = new EmbedBuilder()
				.setColor(Juge.color)
				.setAuthor({ name: Juge.name, iconURL: Juge.icon })
				.setDescription(`${textmsg}`)
				.setTimestamp();
			// envoi de l'embed
			client.channels.cache
				.get(destination)
				.send({
					embeds: [msgembed],
					files : files,
				}).catch(errHandler);
			// messages de confirmation
			await interaction.reply(`Message transmis à <#${destination}> (ID ${destination}), envoyé par : ${Juge.name}`).catch(errHandler);
			// gestion de la longueur des messages
			if (textmsg.length <= 1900) {
				interaction.followUp(`>>> ${textmsg}`).catch(errHandler);
			}
			else {
				interaction.followUp(`>>> ${textmsg.slice(0, 1800)} ... \n(Le message entier est trop long pour être affiché mais a été retransmis en intégralité)`).catch(errHandler);
			}
		}
		else {
			await interaction.reply({
				content: '❌ Vous n\'avez pas l\'autorisation d\'utiliser cette commande.',
				ephemeral: true,
			});
		}
	},
};