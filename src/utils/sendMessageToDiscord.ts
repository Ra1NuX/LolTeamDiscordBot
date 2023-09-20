import { CurrentGameInfoDTO } from "twisted/dist/models-dto";
import env from "../env";
import { ChannelType, Client, EmbedBuilder } from "discord.js";

const sendMessageToDiscord = async (currentGame: CurrentGameInfoDTO, client: Client) => {

    const serverId = env.DISCORD_SERVER_ID;

    const guild = await client.guilds.fetch(serverId);
    const channel = guild.channels.cache.find(ch => ch.id === env.DISCORD_CHANNEL_ID && ch.type === ChannelType.GuildText);

    if (!channel) return console.log('No se ha encontrado el canal');
    if (channel && channel.isTextBased()) {

        const filterByTeamId = new Set<number>(currentGame.participants!.map(p => p.teamId!));

        const embed = new EmbedBuilder()
            .setTitle(`Se esta jugando una partida Scrim!`)
            .setColor(0x00AE86)
            .setURL(`https://www.leagueofgraphs.com/es/match/euw/${currentGame.gameId}`)
            .setDescription(`¡3 o más miembros están en la misma partida! ID de la partida: ${currentGame.gameId}`)
            .setFields([
                { name: 'Equipo 1: ', value: currentGame.participants!.map(p => p.teamId === [...filterByTeamId][0] && p.summonerName).join(', ') },
                { name: 'Equipo 2: ', value: currentGame.participants!.map(p => p.teamId === [...filterByTeamId][1] && p.summonerName).join(', ') }
            ])
            .setTimestamp(new Date());


        channel.send({ embeds: [embed] });
    }

};

export default sendMessageToDiscord;