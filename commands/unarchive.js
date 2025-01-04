const { SlashCommandBuilder } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la commande /unarchive :', err);};
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unarchive')
		.setDescription('Désarchiver tous les fils dans un salon ou un forum')
		.addStringOption(option =>
			option.setName('parent')
				.setDescription('ID du salon ou forum')
				.setRequired(true)),
	async execute(interaction) {
		const parentID = interaction.options.getString('parent');
		// check permissions
		if (interaction.user.id === config.ownerId) {
			// check channel
            const parent = client.channels.cache.find(c => c.id === parentID);
			// recherche des threads archivés hors cache
            const archived = await parent.threads.fetchArchived()
			// nombre concerné
			const archsize = archived.threads.size
            // exécution de la commande
            archived.threads.forEach(thread => {
				thread.setArchived(false);
				thread.setLocked(false);
		});
			await interaction.reply({
			content: `Vous avez désarchivé ${archsize} fils dans <#${parent.id}>.`,
		}).catch(errHandler)				
			.then(console.log(`Désarchivage de ${archsize} fils dans ${parent.name}.`));
		}
        else {
			await interaction.reply({
				content: '❌ Vous n\'avez pas l\'autorisation d\'utiliser cette commande.',
				ephemeral: true,
			});
		}
	},
};


//
            // exécution de la commande
//            archived.threads.forEach(thread => {
//				thread.setArchived(false);
//				thread.setLocked(false);
//		});