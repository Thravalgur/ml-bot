const { EmbedBuilder } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec l\'attribution ou les logs du rôle Inscrit :', err);};
const config = require('../config.json');
const varspath = '../config-vars.json';
let vars = require(varspath);

module.exports = {
	name: 'sendInscrit',
	async execute(interaction) {
		const inscritrole = config.inscritRole;
		const user = interaction.user;
		const member = interaction.member;
		const title = interaction.fields.getTextInputValue('titleInput');
		// gérer le cache des variables
		await delete require.cache[require.resolve(varspath)];
		vars = require(varspath);
		// embed pour notifier de l'ajout du rôle
		const addembed = new EmbedBuilder()
			.setColor(config.Blue)
			.setTitle('Rôle reçu')
			.setDescription(`**Vous avez reçu le rôle** <@&${inscritrole}> et l'accès à <#${config.inscritChannel}>. \n ${vars.infoinscrit}`)
			.setTimestamp();
		// ajouter le rôle
		const role = await member.roles.add(inscritrole).catch(errHandler);
		// notifier
		if (role) {
			await interaction.reply({
				embeds: [addembed],
				ephemeral: true,
			})
				.catch(errHandler);
			// envoyer les logs
			await client.channels.cache
				.get(config.logsChannel)
				.send({
					content : `Inscription avec : *${title}* de ${user.displayName} (${user.username} / <@!${user.id}>).`,
				}).catch(errHandler);
		}
		else {
			throw (errHandler);
		}
	},
};