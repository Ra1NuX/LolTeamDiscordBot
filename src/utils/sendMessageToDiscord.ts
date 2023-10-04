import { CurrentGameInfoDTO } from "twisted/dist/models-dto";
import env from "../env";
import { ChannelType, Colors, EmbedBuilder } from "discord.js";
import getDiscordClient from "./getDiscordClient";
import formatTeam from "./formatTeam";

export enum Target {
    channel = 'CHANNEL',
    user = 'USER'
}

const sendMessageToDiscord = async (currentGame: CurrentGameInfoDTO, target: Target, name?: string) => {

    const client = getDiscordClient();
    const serverId = env.DISCORD_SERVER_ID;
    const guild = await client.guilds.fetch(serverId);

    const teams = formatTeam(currentGame)

    const embed = new EmbedBuilder()
        .setTitle(`Se esta jugando una ${target === Target.user ? `partida con tu cuenta ${name}` : 'Scrim!'}!`)
        .setColor(Colors.Yellow)
        .setURL(`https://www.leagueofgraphs.com/es/match/euw/${currentGame.gameId}`)
        .setDescription(`${target === Target.user ? `${name} esta jugando una SoloQ: ` : '¡3 o más miembros están en la misma partida!'} ID de la partida: ${currentGame.gameId}`)
        .setFields([
            { name: 'Equipo 1: ', value: teams.team1 },
            { name: 'Equipo 2: ', value: teams.team2 }
        ])
        .setTimestamp(new Date(currentGame.gameStartTime));

    if (target === Target.user) {

        if (!name) throw Error('En el modo "USER" el name es requerido');

        const roleName = env.DISCORD_ROLE_NAME;
        const role = guild.roles.cache.find(r => r.name === roleName);

        if (role?.id) {
            const usersWithPlayerRole = guild.members.cache.filter(member => member.roles.cache.has(role.id));
            const user = usersWithPlayerRole.find(member => (member.nickname || member.user.globalName || member.user.username) === name)

            if (user) {
                await user.send({ embeds: [embed] });
            }

        }

    } else {

        const channel = guild.channels.cache.find(ch => ch.id === env.DISCORD_CHANNEL_ID && ch.type === ChannelType.GuildText);

        if (!channel) return console.log('No se ha encontrado el canal');

        if (channel && channel.isTextBased()) {
            await channel.send({ embeds: [embed] });
        }

    }
};

export default sendMessageToDiscord;