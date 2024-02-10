const { EmbedBuilder } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la demande du rôle Scriptorium :', err);};
const config = require('../config.json');
const varspath = '../config-vars.json';
let vars = require(varspath);

module.exports = {
	name: 'askAnim',
	async execute(interaction) {
		const animrole = config.animRole;
		const member = interaction.member;
		// gérer le cache des variables
		delete require.cache[require.resolve(varspath)];
		vars = require(varspath);
		// embed pour notifier du retrait du rôle
		const noembed = new EmbedBuilder()
			.setColor(config.Blue)
			.setTitle('Rôle retiré')
			.setDescription(`**Vous avez retiré le rôle** <@&${animrole}> : vous ne recevrez plus les notifications des animations, mais vous pourrez toujours y participer ou reprendre le rôle plus tard !`)
			.setTimestamp();
		// embed pour notifier de l'ajout du rôle
		const addembed = new EmbedBuilder()
			.setColor(config.Blue)
			.setTitle('Rôle reçu')
			.setDescription(`**Vous avez reçu le rôle** <@&${animrole}> : vous recevrez les notifications des animations. \n${vars.infoanim}`)
			.setTimestamp();
		// retirer le rôle si présent
		if (member.roles.cache.some(role => role.id === animrole)) {
			await member.roles.remove(animrole)
				.then (interaction.reply({
					embeds: [noembed],
					ephemeral: true,
				}))
				.catch(errHandler);
		}
		// ajouter le rôle si absent
		else {
			const role = await member.roles.add(animrole).catch(errHandler);
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