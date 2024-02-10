const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la commande /send :', err);};
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('send')
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
				)),
	async execute(interaction) {
		// vérification des permissions
		const serverID = interaction.guild.id;
		if (serverID === config.hubGuild) {
			// préparation des données pour l'embed
			const destination = interaction.options.getString('destination').trim();
			// créer la boucle pour changer la couleur et l'url en fonction de l'auteur
			const Juge = config.Juge.find((x) => x.id === interaction.options.getString('juge'));
			// messages de confirmation
			await interaction.reply({ content : `Message en préparation pour <#${destination}> (ID ${destination}), envoyé par : ${Juge.name}. 
			\n Votre prochain message sera envoyé à la destination indiquée. Vous pouvez y joindre un fichier. 
			\n Attention, si vous modifiez le message envoyé, cela ne sera pas transmis !
			\n Si vous voulez annuler la commande, attendez : elle expirera au bout de 20 secondes.`, fetchReply: true }).catch(errHandler);
			// prendre en charge la récupération du message suivant
			// filtrer par auteur du message
			const filter = m => m.author.id === interaction.user.id;
			await interaction.channel.awaitMessages({ filter, max: 1, time: 20_000, errors: ['time'] })
				.then(collected => {
					const message = collected.first();
					// vérifier si fichiers images ou documents joints
					const files = [];
					if (message.attachments.size > 0) message.attachments.forEach((file) => files.push(file.url));
					// vérifier si message vide
					const voidtext = '*(Message vide)*';
					const content = message.content;
					let textmsg = content;
					if (content.length <= 0) textmsg = voidtext;
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
					// gestion de la longueur des messages
					if (textmsg.length <= 1900) {
						interaction.followUp(`Vous avez envoyé le message : \n>>> ${textmsg}`).catch(errHandler);
					}
					else {
						interaction.followUp(`>>> ${textmsg.slice(0, 1800)} ... \n(Le message entier est trop long pour être affiché mais a été retransmis en intégralité)`).catch(errHandler);
					}
				})
				.catch(collected => {
					interaction.followUp(`Erreur ou délai dépassé. Votre envoi de message a été annulé. \n Collecté : ${collected}`).catch(errHandler);
					console.log('échec de la commande, collecté : ', collected);
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