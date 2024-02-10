// Configuration des variables
const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const config = require('./config.json');
require('dotenv').config();
const BotToken = process.env.CLIENT_TOKEN;

// Préparation de la récupération des commandes
const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
// SlashCommandBuilder#toJSON() : récupération de "data" pour chaque commande afin de finaliser le déploiement
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	}
	else {
		console.log(`[ATTENTION] ${file} : la propriété requise "data" ou "execute" n'a pas été détectée.`);
	}
}

// REST module : nouvelle instance créée et paramétrée
const rest = new REST().setToken(BotToken);

// Déploiement des commandes
(async () => {
	try {
		console.log(`Initialisation du déploiement de ${commands.length} commandes (/) du bot MLBot.`);

		// Remplacement des commandes pour l'ensemble des serveurs
		const data = await rest.put(
			Routes.applicationCommands(config.clientId),
			{ body: commands },
		);

		console.log(`Déploiement terminé pour ${data.length} commandes (/) du bot MLBot.`);
	}
	catch (error) {
		console.error(error);
	}
})();