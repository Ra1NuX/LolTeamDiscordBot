import 'dotenv/config';
import { ChannelType, Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';
import { Kayn, REGIONS } from 'kayn';
import { SpectatorV4CurrentGameInfo } from 'kayn/typings/dtos';

import env from './env';

const api = Kayn(process.env.RIOT_API_KEY)({ region: REGIONS.EUROPE_WEST });

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages]});

client.on('ready', async () => {
    console.log('Client is ready!');

    const serverId = env.DISCORD_SERVER_ID;
    const roleName = env.DISCORD_ROLE_NAME;

    const guild = await client.guilds.fetch(serverId);
    await guild.members.fetch();  // Esto obtiene todos los miembros del servidor
    const role = guild.roles.cache.find(r => r.name === roleName);

    if (!role) throw Error(`Role ${roleName} does not exist`);

    const summonerNames = guild.members.cache.filter(member => member.roles.cache.has(role.id)).map(member => (member.nickname || member.user.globalName || member.user.username));

    const summonerStatus: { [name: string]: { inGame: boolean, gameId?: number } } = {};


    // Inicializar el estado de los invocadores
    for (const name of summonerNames) {
        summonerStatus[name] = { inGame: false }; // inGame: false significa que no están en una partida
    }

    const gameCounts: { [gameId: string]: number } = {};
    const notifiedGames = new Map<number, number>();

    // Función para comprobar si un invocador ha comenzado una partida
    async function checkSummonerGame(name: string) {
        try {
            const summoner = await api.Summoner.by.name(name);

            if (!summoner || !summoner.id) {
                console.log(`No se ha encontrado a ${name}`); 
                return;
            }

            let currentGame: SpectatorV4CurrentGameInfo | null = null;

            try {
                currentGame = await api.CurrentGame.by.summonerID(summoner.id) as SpectatorV4CurrentGameInfo;
            } catch (error: any) {
                if (error.statusCode === 404) {
                    // El invocador no está en una partida
                    currentGame = null;
                } else {
                    // Otro tipo de error (p.ej., problemas de red, límites de tasa, etc.)
                    console.error("Error al obtener el juego actual:", error);
                }
            }
            
            console.log({ currentGame: currentGame?.gameId, summonerStatus: summonerStatus[name] })

            if (currentGame?.gameId && !summonerStatus[name].inGame) {
                console.log(`${name} ha comenzado una partida!`);
                summonerStatus[name].inGame = true;
                summonerStatus[name].gameId = currentGame.gameId;

                const gameId = currentGame.gameId!;

                // Aumentar el contador para esta partida
                if (!gameCounts[gameId]) {
                    gameCounts[gameId] = 0;
                }
                gameCounts[gameId]++;

                // Verificar si hay 3 o más jugadores en esta partida
                if (gameCounts[gameId] >= (Number(process.env.PLAYERS_IN_GAME) || 3)  && !notifiedGames.has(gameId) ) {
                    const channel = guild.channels.cache.find(ch => ch.id === env.DISCORD_CHANNEL_ID && ch.type === ChannelType.GuildText); 
                    
                    

                    if(!channel) return console.log('No se ha encontrado el canal');
                    if (channel && channel.isTextBased()) {

                        const filterByTeamId = new Set<number>(currentGame.participants!.map(p => p.teamId!));

                        const embed = new EmbedBuilder()
                        .setTitle(`Se esta jugando una partida Scrim!`)
                        .setColor(0x00AE86)
                        .setURL(`https://www.leagueofgraphs.com/es/match/euw/${currentGame.gameId}`)
                        .setDescription(`¡3 o más miembros están en la misma partida! ID de la partida: ${gameId}`)
                        .setFields([
                            { name: 'Equipo 1: ', value: currentGame.participants!.map(p => p.teamId === [...filterByTeamId][0] && p.summonerName ).join(', ') },
                            { name: 'Equipo 2: ', value: currentGame.participants!.map(p => p.teamId === [...filterByTeamId][1] && p.summonerName ).join(', ') }
                        ])
                        .setTimestamp();


                        channel.send({ embeds: [embed] });
                    }

                    notifiedGames.set(gameId, Date.now());
                }
            } else if (!currentGame && summonerStatus[name].inGame) {
                console.log(`${name} ha finalizado la partida!`);
                summonerStatus[name].inGame = false;

                // Disminuir el contador para la partida anterior de este jugador
                const previousGameId = summonerStatus[name].gameId;
                if (previousGameId && gameCounts[previousGameId]) {
                    gameCounts[previousGameId]--;
                    if (gameCounts[previousGameId] <= 0) {
                        delete gameCounts[previousGameId];
                    }
                }
                delete summonerStatus[name].gameId; // Limpiar el ID de la partida anterior

            }
        } catch (e) {
            // console.log(e)
        }
    }

    // Establecer un intervalo para comprobar regularmente
    setInterval(() => {
        for (const name of summonerNames) {
            checkSummonerGame(name);
        }
    }, 450000); // Comprobar cada minuto

    const time = 6 * 60 * 60 * 1000;

    setInterval(() => {
        const now = Date.now();
        for (const [gameId, timestamp] of notifiedGames.entries()) {
            if (now - timestamp > time) {
                notifiedGames.delete(gameId);
            }
        }
    }, time);  // Revisa cada día, pero puedes ajustar esto según tus necesidades
});

client.login(process.env.DISCORD_TOKEN);