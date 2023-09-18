import { Client, GatewayIntentBits } from 'discord.js';
import start from './utils/start';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages] });

client.on('ready', start);

client.login(process.env.DISCORD_TOKEN);
