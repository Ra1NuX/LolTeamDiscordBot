import { Client } from "discord.js";
import env from "../env";
import getDiscordClient from "./getDiscordClient";

const getSummonerNames = async () => {

    const serverId = env.DISCORD_SERVER_ID;
    const roleName = env.DISCORD_ROLE_NAME;

    const client = getDiscordClient();

    const guild = await client.guilds.fetch(serverId);
    await guild.members.fetch();  // Esto obtiene todos los miembros del servidor
    const role = guild.roles.cache.find(r => r.name === roleName);

    if (!role) throw Error(`Role ${roleName} does not exist`);

    const onlyUsersWithRole = guild.members.cache.filter(member => member.roles.cache.has(role.id));
    const userNick = onlyUsersWithRole.map(member => (member.nickname || member.user.globalName || member.user.username));

    return userNick;
}

export default getSummonerNames;