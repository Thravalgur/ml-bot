const { SlashCommandBuilder, ChannelFlags } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la commande /threaddelete :', err);};
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('threaddelete')
		.setDescription('Supprimer les fils dans un salon ou un forum')
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
			// nombre de suppressions
			const parentsize = parent.threads.cache.size;
			let deletedsize = parentsize;
			// exécution de la commande
            parent.threads.cache.forEach(thread => {
				// exception des posts épinglés dans les forums		
				if (thread.flags.has(ChannelFlags.Pinned)) {
					deletedsize = parentsize-1;
				}
				else {
					thread.delete();
				}
			});
			await interaction.reply({
				content: `Vous avez supprimé ${deletedsize} fils dans ${parent.name}.`,
			}).catch(errHandler)				
				.then(console.log(`Suppression de ${deletedsize} fils dans ${parent.name}.`));
		}
        else {
			await interaction.reply({
				content: '❌ Vous n\'avez pas l\'autorisation d\'utiliser cette commande.',
				ephemeral: true,
			});
		}
	},
};