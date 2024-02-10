const { EmbedBuilder } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la détection ou la transmission des messages édités :', err);};
const config = require('../config.json');

module.exports = {
	name: 'messageUpdate',
	async execute(oldMessage, newMessage) {
		// ignorer si non pertinent
		if (newMessage.author.bot || newMessage.channel.type === 'dm' || newMessage.guildId !== config.ticketGuild) return;
		// ignorer les stickers
		if (newMessage.stickers.size > 0) return;
		// oldMessage fetch
		const oldMsg = [];
		if (oldMessage.partial) {
			oldMessage.fetch().catch(errHandler);
			oldMsg.push('*(Un ancien message a été édité et n\'a pas pu être récupéré)*');
		}
		else {
			oldMsg.push(oldMessage.content.slice(0, 1000));
		}
		// détecter les categories
		const Category = config.Category.find((x) => x.ticketparent === newMessage.channel.parentId);
		if (!Category) return;
		// vérifier si fichiers images ou documents joints
		const files = [];
		if (newMessage.attachments.size > 0) newMessage.attachments.forEach((file) => files.push(file.url));
		// vérifier si message vide
		const content = newMessage.content;
		const text = '*(Message vide)*';
		const messagetxt = content ?? text;
		// embed
		const msgembed = new EmbedBuilder()
			.setTitle(`Message retransmis venant de : ${newMessage.channel.name}`)
			.setColor(config.Blue)
			.setDescription(messagetxt)
			.addFields(
				{
					name: 'Ancien message',
					value: `${oldMsg}`,
				},
			)
			.setFooter(
				{
					text :`Pour répondre à ce message, utilisez la commmande /send et remplissez-la ainsi : /send destination:${newMessage.channel.id} juge:<Votre nom de juge (N° ou lettre)>`,
				},
			)
			.setTimestamp();
		// send to mirror thread
		const hubForum = client.channels.cache.find(channel => channel.id === Category.hubparent);
		hubForum.threads.fetchArchived();
		hubForum.threads.fetchActive();
		const hubThread = hubForum.threads.cache.find(thread => thread.name === newMessage.channel.name);
		const errorThread = hubForum.threads.cache.find(thread => thread.id === Category.huberror);
		const hub = hubThread ?? errorThread;
		await hub.setArchived(false);
		await hub.setLocked(false);
		await hub.send({
			embeds: [msgembed],
			files : files,
		}).catch(errHandler);
	},
};