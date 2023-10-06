import { MatchV5DTOs } from "twisted/dist/models-dto";
import env from "../env";
import { ChannelType, Colors, EmbedBuilder } from "discord.js";
import getDiscordClient from "./getDiscordClient";
import formatTeam from "./formatTeam";

export enum Target {
    channel = 'CHANNEL',
    user = 'USER'
}

const sendMessageToDiscord = async (currentGame: MatchV5DTOs.InfoDto, target: Target, name?: string) => {

    const client = getDiscordClient();
    const serverId = env.DISCORD_SERVER_ID;
    const guild = await client.guilds.fetch(serverId);

    console.log(`Se esta enviando un mensaje a discord en modo ${target} ${name ? `a ${name}` : ''}`);

    const teams = formatTeam(currentGame);


    const embed = new EmbedBuilder()
        .setTitle(`Se ha analizado la ultima ${target === Target.user ? `partida con tu cuenta ${name}` : 'scrim'}`)
        .setURL(`https://www.leagueofgraphs.com/es/match/euw/${currentGame.gameId}`)
        .setFields([
            { name: 'Equipo 1: \n ', value: teams.team1, inline: true },
            { name: 'Equipo 2: \n ', value: teams.team2, inline: true }
        ])
        .setTimestamp(new Date(currentGame.gameStartTimestamp));

    if (target === Target.user) {

        if (!name) throw Error('En el modo "USER" el name es requerido');

        const roleName = env.DISCORD_ROLE_NAME;
        const role = guild.roles.cache.find(r => r.name === roleName);

        if (role?.id) {
            if (env.LOCAL_USERNAME) {
                await guild.members.fetch()
            }
            const usersWithPlayerRole = guild.members.cache.filter(member => member.roles.cache.has(role.id));
            const user = usersWithPlayerRole.find(member => (member.nickname || member.user.globalName || member.user.username) === name)


            if (user) {
                const selectedUser = currentGame.participants.find(p => p.summonerName === name)
                if(!selectedUser) return; 
                const {win, championName, kills, deaths, assists} = selectedUser;

                embed
                .setDescription(`${kills}/${deaths}/${assists} (${((kills+assists)/deaths).toFixed(2)}%)`)
                .setColor(win ? Colors.Green : Colors.Red)
                .setThumbnail(`https://ddragon.leagueoflegends.com/cdn/13.19.1/img/champion/${championName}.png`)

                await user.send({ embeds: [embed] });
            }

        }

    } else {

        const channel = guild.channels.cache.find(ch => ch.id === env.DISCORD_CHANNEL_ID && ch.type === ChannelType.GuildText);
        if (!channel) return console.log('No se ha encontrado el canal');

        if (channel && channel.isTextBased()) {
            embed
            .setColor(Colors.Yellow);

            await channel.send({ embeds: [embed] });
        }

    }
};

export default sendMessageToDiscord;