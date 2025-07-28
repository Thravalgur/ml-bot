const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la commande /catdelete :', err);};
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('catdelete')
		.setDescription('Supprimer les salons dans une catégorie')
		.addStringOption(option =>
			option.setName('category')
				.setDescription('ID de la catégorie')
				.setRequired(true)),
	async execute(interaction) {
		const cateID = interaction.options.getString('category');
		// check permissions
		if (interaction.user.id === config.ownerId) {
			// check catégorie
            const category = client.channels.cache.find(c => c.id === cateID);
			// compte salons
			const catsize = category.children.cache.size;
			// exécution commande
            category.children.cache.forEach(channel => channel.delete());
			await interaction.reply({
				content: `Vous avez supprimé ${catsize} salons dans la catégorie ${category.name}.`,
			}).catch(errHandler)
				.then(console.log(`Suppression de ${catsize} salons dans ${category.name}.`));
		}
        else {
			await interaction.reply({
				content: '❌ Vous n\'avez pas l\'autorisation d\'utiliser cette commande.',
				flags: MessageFlags.Ephemeral,
			});
		}
	},
};