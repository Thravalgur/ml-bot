const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la commande /botinfo :', err);};
const config = require('../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('botinfo')
		.setDescription('Donne les crédits du bot.'),
	async execute(interaction) {
		const embed = new EmbedBuilder()
			.setColor(config.Blue)
			.setDescription(`Développé par **Thravalgur** (<@${config.ownerId}>) pour l'association [Les Murmures Littéraires]${config.website.association}.
          \n Créé avec [discord.js](https://discordjs.guide/).
          \n\n Initialement basé sur les bots de [Sayrix](https://github.com/Sayrix/ticket-bot) et [@Phil|Flipper#3621](https://github.com/FlipperLP/I-SH).`)
			.setTimestamp();
		await interaction.reply({
			embeds: [embed],
		}).catch(errHandler);
	},
};