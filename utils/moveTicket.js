const { EmbedBuilder } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec l\'ouverture d\'un ticket :', err);};
const config = require('../config.json');
const varspath = '../config-vars.json';
let vars = require(varspath);

module.exports = {
	name: 'moveTicket',
	async execute(interaction) {
		const inscritrole = config.inscritRole;
		const user = interaction.user;
		const member = interaction.member;
		// prise en compte de la catégorie
		const Category = config.Category.find((x) => x.id === interaction.values[0]);
		if (!Category) return console.error(`ERREUR : la catégorie ${interaction.values[0]} n'est pas prise en charge !`);
		// gérer le cache des variables
		await delete require.cache[require.resolve(varspath)];
		vars = require(varspath);
		// récupérer le titre du manuscrit
		const topictxt = interaction.channel.topic;
		const replacerule1 = 'Demande pour votre manuscrit';
		const replacerule2 = 'en attente';
		const title = topictxt
			.replace(replacerule1, '')
			.replace(replacerule2, '')
			.trim();
		// mise à jour du ticket
		await interaction.channel.edit({
			parent: Category.ticketparent,
			topic: `Discussion avec le jury pour votre manuscrit ${title}, inscrit en catégorie ${Category.name}. L'anonymat de la participation doit être conservé si le manuscrit concourt en étape 2.`,
		}).catch(errHandler);
		// supprimer le message temporaire précédent
		const msg = await interaction.channel.lastMessage;
		if (msg.deletable) {
			await msg.delete();
		}
		else {
			await console.log(`ERREUR : la suppression du message initial n'a pas été effectuée dans le ticket de ${title}`);
		}
		// créer le premier message d'ouverture
		const newTicketembed = new EmbedBuilder()
			.setColor(config.Blue)
			.setTitle('Ouverture de la discussion')
			.setDescription(`Votre discussion est ouverte, <@!${user.id}> !
			\nTout message envoyé ici sera transmis immédiatement au jury, et les réponses vous seront transmises de la même façon.`)
			.addFields(
				{
					name:'Anonymat',
					value:`Conserver **l'anonymat des membres du jury et des participations** est l'objectif premier de ce système de discussion.
					\nSi votre manuscrit fait partie de ceux sélectionnés pour l'étape finale et que celle-ci est toujours en cours, souvenez-vous de ne pas donner d'information susceptible de rompre l'anonymat de votre participation. 
					\nQuelle que soit l'issue de la dernière étape, vous ne pouvez pas non plus sommer les membres du jury de lever leur anonymat.`,
				},
				{
					name:'Rectifier un message envoyé',
					value:`Pour des raisons pratiques, **l'envoi d'un nouveau message** est la solution à privilégier.
					\nSi vous **supprimez** un de vos messages, cela n'aura **aucun effet** du côté du jury : la copie retransmise sera conservée, et la suppression ne sera pas notifiée. 
					\nSi vous **modifiez** un message en éditant son contenu, la modification sera notifiée au jury et le nouveau contenu lui sera transmis. Toutefois, cela peut rendre la discussion plus difficile à suivre.`,
				},
				{
					name:'Limitations techniques',
					value:'Les **fichiers** (image, document) seront bien retransmis, mais les **autocollants** Discord (si vous avez la possibilité d\'en envoyer) ne pourront pas l\'être.',
				},
				{
					name:'Pas de réponse',
					value:`En raison du nombre de messages, des erreurs (humaines ou informatiques) peuvent arriver. 
					\nLa retransmission de votre messsage a pu être bloquée, ou les membres du jury peuvent ne pas être disponibles pour répondre. 
					\nFaites une relance si vous n'obtenez aucune réponse, mais usez de ces rappels avec modération.
					`,
				},
				{
					name:'Que faire en cas de problème ?',
					value:`Merci de reporter tout problème (technique ou relatif à la teneur des échanges) dans ⁠<#${config.helpChannel}> ou en message privé à l'un des membres du Conseil d'Administration.`,
				},

			)
			.setTimestamp();
			// envoyer le premier message d'ouverture
		const openedMsg = await interaction.channel.send({
			embeds: [newTicketembed],
		}).catch(errHandler);
			// épingler le premier message d'ouverture
		await openedMsg.pin().then(() => {
			interaction.channel.bulkDelete(1);
		}).catch(errHandler);
		// ajout du rôle ticket ouvert
		await interaction.member.roles.add(config.banRole).catch(errHandler);

		// ajout du rôle d'inscrit si manquant
		if (member.roles.cache.some(role => role.id === inscritrole)) {
			console.log('Rôle inscrit déjà présent');
		}
		else {
			console.log('Rôle inscrit non présent, à rajouter')
		// embed pour notifier de l'ajout du rôle
			const addembed = new EmbedBuilder()
				.setColor(config.Blue)
				.setTitle('Rôle reçu')
				.setDescription(`**Vous avez reçu le rôle** <@&${inscritrole}> et l'accès à <#${config.inscritChannel}> !`)
				.setTimestamp();
			const role = await member.roles.add(inscritrole).catch(errHandler);
			if (role) {
				await interaction.reply({
					embeds: [addembed],
					ephemeral: true,
				}).catch(errHandler);
			}
			else {
				throw (errHandler);
			}
		}
		// embed pour les logs sur le serveur externe
		const logsembed = new EmbedBuilder()
			.setColor(config.Blue)
			.setTitle('Nouveau ticket ouvert')
			.setDescription(`${user.displayName} (${user.username} / <@!${user.id}>). Discussion sur ${title}, inscrit en catégorie ${Category.name}.`)
			.setTimestamp();
		// embed pour les logs anonymes du serveur interne
		const hublogsembed = new EmbedBuilder()
			.setColor(config.Blue)
			.setTitle('Nouveau ticket ouvert')
			.setDescription(`Discussion sur ${title}, inscrit en catégorie ${Category.name}.`)
			.setTimestamp();		
		
		// logs pour l'ouverture effective du ticket sur le serveur externe
		await client.channels.cache
			.get(config.logsChannel)
			.send({
				embeds: [logsembed],
			}).catch(errHandler);
		// logs pour l'ouverture effective du ticket sur le serveur externe
		await client.channels.cache
			.get(config.hublogsChannel)
			.send({
				embeds: [logsembed],
			}).catch(errHandler);
		await console.log('Ouverture ticket réussie');

		// créer le post miroir côté jury
		const CategoryForum = client.channels.cache.get(Category.hubparent);
		const newThread = await CategoryForum.threads.create({
			name: interaction.channel.name,
			message: { content: `Début de la future discussion entre la personne qui participe avec le manuscrit ${title} et les juges qui l'ont lu. 
			\n\n**Anonymat**
			\nConserver **l'anonymat des membres du jury et des participations** est l'objectif premier de ce système de discussion.
			\nSi le manuscrit dont vous discutez fait partie de ceux sélectionnés pour l'étape 2 et que les résultats finaux n'ont pas encore été annoncés, souvenez-vous de ne pas donner d'information qui concernent l'étape en cours et conservez votre anonymat.
			\nVous ne pouvez en aucun cas demander à l'auteur ou l'autrice de lever son anonymat ou lever celui des autres juges sans leur assentiment au cours de la discussion.
			\n\n**Comment discuter ?** 
			\nPour répondre, vous devez utiliser la commande /send. Il est conseillé de préparer votre message en avance pour éviter que l'envoi s'annule. Pour "destination", indiquez l'identifiant (ID) de la discussion : **${interaction.channel.id}**. Pour "juge", indiquez si vous étiez Juge 1 ou 2 à la première étape, ou Juge A, B, C ou D à la deuxième (voir le tableau du Qui lit quoi). Après l'envoi de la commande, écrivez le message que vous voulez envoyer. Vous pouvez y joindre des fichiers (images, documents) qui seront également transmis à l'auteur.              
			\nLe tableau Qui lit quoi avec les informations sur les manuscrits, la correspondance des numéros des juges et les liens des fiches fusionnées : ${vars.quilitquoi}` },
			autoArchiveDuration: 10080,
		}).catch(errHandler);
		await newThread.lastMessage.pin().then(() => {
			newThread.bulkDelete(1);
		}).catch(errHandler);
	},
};
