const { SlashCommandBuilder, EmbedBuilder, ChannelType, MessageFlags } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la commande /autosend :', err);};
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('autosend')
		.setDescription('Envoyer un message')
		.addStringOption(option =>
			option.setName('juge')
				.setDescription('Votre nom de juge (1 2, ou 3 / A, B, C ou D)')
				.setRequired(true)
				.addChoices(
					{ name: '1 (étape 1)', value: '1' },
					{ name: '2 (étape 1)', value: '2' },
					{ name: '3 (étape 1)', value: '3' },
					{ name: 'A (étape 2)', value: 'a' },
					{ name: 'B (étape 2)', value: 'b' },
					{ name: 'C (étape 2)', value: 'c' },
					{ name: 'D (étape 2)', value: 'd' },
					{ name: 'Organisation', value: 'ml' },
				)),
	async execute(interaction) {
		// vérification des permissions
		if (interaction.guild.id === config.hubGuild && interaction.channel.type === ChannelType.PublicThread) {
			// préparation de la destination
			const Category = config.Category.find((x) => x.hubparent === interaction.channel.parentId);
			const autoparent = client.channels.cache.find(c => c.id === Category.ticketparent);
			const autodestination = autoparent.children.cache.find(channel => channel.name === interaction.channel.name);
			const destinationID = autodestination.id;
			// créer la boucle pour changer la couleur et l'url en fonction de l'auteur
			const Juge = config.Juge.find((x) => x.id === interaction.options.getString('juge'));
			// messages de confirmation
			await interaction
				.reply({ 
					content : `Message en préparation pour <#${destinationID}>, envoyé par : ${Juge.name}.\nCopiez-collez un message qui sera envoyé à la destination indiquée. Vous pouvez y joindre un fichier. \n-# Si ce que vous avez à dire ne tient pas sur un seul message, vous devrez utiliser la commande plusieurs fois. Après confirmation de l'envoi, votre message d'origine sera effacé et vous ne pourrez plus l'éditer. \n-# Si vous voulez annuler la commande, attendez : elle expirera au bout de 1 minute.`,
					flags: MessageFlags.Ephemeral,					
					fetchReply: true,
				 })
				.catch(errHandler);
			// prendre en charge la récupération du message suivant
			// filtrer par auteur du message
			const filter = m => m.author.id === interaction.user.id;
			await interaction.channel.awaitMessages({ filter, max: 1, time: 60_000, errors: ['time'] })
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
						.setDescription(`${textmsg}`);
					// envoi de l'embed
					autodestination.send({
							embeds: [msgembed],
							files : files,
						}).catch(errHandler);
					// envoi de la confirmation côté jury
					interaction.followUp({
						content: `### <@${interaction.user.id}> a envoyé le message suivant : \n\n-# Réutiliser la commande : \`/autosend juge:<Votre n°>\``,
						embeds: [msgembed],
						files : files,
					}).catch(errHandler);
					// suppression du message d'origine et du message d'interaction
					message.delete();
				})
				// gestion de l'expiration de la commande
				.catch(collected => {
					interaction.followUp(`Commande : \`/autosend\` utilisée par :${Juge.name}. Erreur ou délai dépassé. Votre envoi de message a été annulé. \n Collecté : ${collected}`).catch(errHandler);
					console.log('échec de la commande, collecté : ', collected);
				});
		}
		// refus pour permissions insuffisantes
		else {
			await interaction.reply({
				content: '❌ Vous n\'avez pas l\'autorisation d\'utiliser cette commande.',
				flags: MessageFlags.Ephemeral,
			});
		}
	},
};