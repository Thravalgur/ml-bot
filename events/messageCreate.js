const { EmbedBuilder } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la détection ou la transmission des messages :', err);};
const config = require('../config.json');

module.exports = {
	name: 'messageCreate',
	async execute(message) {
		// ignorer si non pertinent
		if (message.author.bot || message.channel.type === 'dm' || message.guildId !== config.ticketGuild) return;
		// ignorer les stickers
		if (message.stickers.size > 0) return;
		// détecter les categories
		const Category = config.Category.find((x) => x.ticketparent === message.channel.parentId);
		if (!Category) return;
		// vérifier si fichiers images ou documents joints
		const files = [];
		if (message.attachments.size > 0) message.attachments.forEach((file) => files.push(file.url));
		// vérifier si message vide
		const voidtext = '*(Message vide)*';
		const content = message.content;
		let messagetxt = content;
		if (content.length <= 0) messagetxt = voidtext;
		// embed
		const msgchannel = message.channel.name;
		const msgembed = new EmbedBuilder()
			.setTitle(`Message retransmis de ${msgchannel}`)
			.setColor(config.Blue)
			.setDescription(messagetxt);
		// send to mirror thread
		// trouver le forum de la catégorie
		const hubForum = client.channels.cache.find(channel => channel.id === Category.hubparent);
		// trouver le fil miroir 
		const regularThread = hubForum.threads.cache.find(thread => thread.name === message.channel.name);
		// trouver le fil miroir si archivé
		const archived = await hubForum.threads.fetchArchived()            
		const archivedThread = archived.threads.find(thread => thread.name === message.channel.name);
		// vérifier si archivé
		const hubThread = regularThread ?? archivedThread;
		// vérifier si erreur
		const errorThread = hubForum.threads.cache.find(thread => thread.id === Category.huberror);
		const hub = hubThread ?? errorThread;
		// désarchiver et déverouiller si archivé ou verouillé
		await hub.setArchived(false);
		await hub.setLocked(false);
		// envoi
		await hub.send({
			embeds: [msgembed],
			files : files,
		}).catch(errHandler);
	},
};