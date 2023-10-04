import getDiscordClient from './utils/getDiscordClient';
import start from './utils/start';

const client = getDiscordClient();

client.on('ready', start);

client.login(process.env.DISCORD_TOKEN);
