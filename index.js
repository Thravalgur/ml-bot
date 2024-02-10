// init Discord
const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
// init env variables
require('dotenv').config();
// init filesystem
const fs = require('node:fs');
// init config
global.config = require('./config.json');
const BotToken = process.env.CLIENT_TOKEN;

// init Discord client
global.client = new Client({
	allowedMentions: { parse: ['users', 'roles'], repliedUser: true },
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

// events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// logging errors & warns
client.on('error', (e) => console.error(e));
client.on('warn', (e) => console.warn(e));
process.on('uncaughtException', (e) => console.warn(e));
// Login the bot
client.login(BotToken);