const { ActionRowBuilder, StringSelectMenuBuilder, ChannelType, PermissionsBitField, EmbedBuilder, MessageFlags } = require('discord.js');
const errHandler = (err) => {console.error('ERREUR avec la configuration d\'une discussion :', err);};
const config = require('../config.json');

module.exports = {
	name: 'configMLTicket',
	async execute(interaction) {
		// récupérer le titre et le transformer en nom de channel Discord
		const title = interaction.fields.getTextInputValue('titleInput');
		const replacerule1 = /[^a-zA-Z0-9œàáâãäåæçèéêëìíîïðñòóôõöøùúûüýÿ'\s-]/g;
		const replacerule2 = /'\s/g;
		const titlename = title
			.toLowerCase()
			.replace(replacerule1, '')
			.replace(replacerule2, '-');
		// créer le ticket de discussion en lui donnant le nom du titre
		const newTicket = await interaction.guild.channels.create({
			name: titlename,
			type: ChannelType.GuildText,
			topic: `Demande pour votre manuscrit *${title}* en attente`,
			permissionOverwrites: [
				{ id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
				{ id: interaction.guild.roles.everyone, deny: [PermissionsBitField.Flags.ViewChannel] },
			],
			parent: config.parentOpened,
		});
		// notifier la création du ticket de discussion
		await interaction.reply({
			content: `Votre discussion aura lieu dans le salon suivant : <#${newTicket.id}>. 
            \nDernière étape avant l'ouverture de la discussion : indiquez la catégorie de votre manuscrit !`,
			flags: MessageFlags.Ephemeral,
		}).catch(errHandler);
		// créer l'embed pour demander la sélection
		const embed = new EmbedBuilder()
			.setColor(config.Blue)
			.setTitle('Ticket')
			.setDescription('Sélectionnez la catégorie de votre manuscrit afin de commencer à discuter avec le jury. \n **ATTENTION** : si vous ne sélectionnez pas de catégorie, la discussion sera fermée.')
			.setTimestamp();
		// créer la boucle pour les options
		const options = [];
		for (const x of config.Category) {
			const a = {
				label: x.name,
				value: x.id,
				emoji: '📔',
			};
			options.push(a);
		}
		// créer le formulaire pour le choix de la catégorie
		const row = new ActionRowBuilder().addComponents(
			new StringSelectMenuBuilder()
				.setCustomId('select-category')
				.setPlaceholder('Quelle est la catégorie de votre manuscrit ?')
				.setMaxValues(1)
				.addOptions(options),
		);
		// envoyer l'embed et le formulaire avec un ping
		await newTicket.send({
			content: `<@!${interaction.user.id}>, c'est la dernière étape avant l'ouverture de la discussion !`,
			embeds: [embed],
			components: [row],
		});
	},
};
