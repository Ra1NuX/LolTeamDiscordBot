import { Client } from "discord.js";
import env from "../env";

const getSummonerNames = async (client: Client) => {
    const serverId = env.DISCORD_SERVER_ID;
    const roleName = env.DISCORD_ROLE_NAME;

    const guild = await client.guilds.fetch(serverId);
    await guild.members.fetch();  // Esto obtiene todos los miembros del servidor
    const role = guild.roles.cache.find(r => r.name === roleName);

    if (!role) throw Error(`Role ${roleName} does not exist`);

    return guild.members.cache.filter(member => member.roles.cache.has(role.id)).map(member => (member.nickname || member.user.globalName || member.user.username));
}

export default getSummonerNames;