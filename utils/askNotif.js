const { EmbedBuilder } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la demande du rôle Notifications :', err);};
const config = require('../config.json');
const varspath = '../config-vars.json';
let vars = require(varspath);

module.exports = {
	name: 'askNotif',
	async execute(interaction) {
		const notifrole = config.notifRole;
		const member = interaction.member;
		// gérer le cache des variables
		await delete require.cache[require.resolve(varspath)];
		vars = require(varspath);
		// embed pour notifier du retrait du rôle
		const noembed = new EmbedBuilder()
			.setColor(config.Blue)
			.setTitle('Rôle retiré')
			.setDescription(`**Vous avez retiré le rôle** <@&${notifrole}> : vous ne recevrez plus les notifications des actualités relatives à nos partenaires et nos gagnants, mais vous pourrez toujours reprendre le rôle plus tard !`)
			.setTimestamp();
		// embed pour notifier de l'ajout du rôle
		const addembed = new EmbedBuilder()
			.setColor(config.Blue)
			.setTitle('Rôle reçu')
			.setDescription(`**Vous avez reçu le rôle** <@&${notifrole}> : vous recevrez les notifications des actualités relatives à nos partenaires et nos gagnants. \n ${vars.infonotif}`)
			.setTimestamp();
		// retirer le rôle si présent
		if (member.roles.cache.some(role => role.id === notifrole)) {
			await member.roles.remove(notifrole)
				.then (interaction.reply({
					embeds: [noembed],
					ephemeral: true,
				}))
				.catch(errHandler);
		}
		// ajouter le rôle si absent
		else {
			const role = await member.roles.add(notifrole).catch(errHandler);
			if (role) {
				await interaction.reply({
					embeds: [addembed],
					ephemeral: true,
				})
					.catch(errHandler);
			}
			else {
				throw (errHandler);
			}
		}
	},
};