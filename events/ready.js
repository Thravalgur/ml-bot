const { ActivityType } = require('discord.js');
const config = require('../config.json');
// possibilité d'envoi automatique du panneau des tickets
// const sendTicket = require('../utils/sendTicket');

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		// confirmer la présence en ligne du bot, mettre l'activité
		console.log(`[${config.name}] : ${client.user.tag} présent sur ${client.guilds.cache.size} serveurs!`);
		client.user.setPresence({ activities: [{ name: config.website.home, type: ActivityType.Watching }], status: 'online' });
		console.log('Ticket Bot connecté!');
		// possibilité d'envoi automatique du panneau des tickets au démarrage
		//		try {
		//			await sendTicket.execute(client);
		//		}
		//		catch (error) {
		//			console.error('ERREUR avec le démarrage du bot :', error);
		//		}
	},
};