const { ChannelType } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la demande ouverture de ticket :', err);};
const config = require('../config.json');

module.exports = {
	name: 'askThreadTicket',
	async execute(interaction) {
		// créer le ticket
		const newThread = await interaction.channel.threads.create({
			name: `Ticket ${interaction.user.displayName} (${interaction.user.username})`,
			type: ChannelType.PrivateThread,
			autoArchiveDuration: 10080,
		}).catch(errHandler);
		await newThread.members.add(interaction.user.id);
		// envoyer les logs et vérification des permissions
		const serverID = interaction.guild.id;
		if (serverID === config.hubGuild) {
			await client.channels.cache
				.get(config.logsmlChannel)
				.send({
					content : `Ouverture de ticket <#${newThread.id}> : ${interaction.user.displayName} (${interaction.user.username} / <@!${interaction.user.id}>).`,
				}).catch(errHandler);
		}
		else if (serverID === config.ticketGuild) {
			await client.channels.cache
				.get(config.logsChannel)
				.send({
					content : `Ouverture de ticket <#${newThread.id}> : ${interaction.user.displayName} (${interaction.user.username} / <@!${interaction.user.id}>).`,
				}).catch(errHandler);
		}
		await interaction.reply({
			content: `Ouverture de ticket dans <#${newThread.id}> : vous pouvez y écrire votre demande.`,
			ephemeral: true,
		}).catch(errHandler)
			.then(console.log('Bouton des tickets envoyé !'));
	},
};