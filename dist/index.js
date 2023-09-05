"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const discord_js_1 = require("discord.js");
const kayn_1 = require("kayn");
const env_1 = __importDefault(require("./env"));
const api = (0, kayn_1.Kayn)(process.env.RIOT_API_KEY)({ region: kayn_1.REGIONS.EUROPE_WEST });
const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds, discord_js_1.GatewayIntentBits.GuildMembers, discord_js_1.GatewayIntentBits.GuildMessages] });
client.on('ready', () => __awaiter(void 0, void 0, void 0, function* () {
    console.log('Client is ready!');
    const serverId = env_1.default.DISCORD_SERVER_ID;
    const roleName = env_1.default.DISCORD_ROLE_NAME;
    const guild = yield client.guilds.fetch(serverId);
    yield guild.members.fetch(); // Esto obtiene todos los miembros del servidor
    const role = guild.roles.cache.find(r => r.name === roleName);
    if (!role)
        throw Error(`Role ${roleName} does not exist`);
    const summonerNames = guild.members.cache.filter(member => member.roles.cache.has(role.id)).map(member => (member.nickname || member.user.globalName || member.user.username));
    const summonerStatus = {};
    // Inicializar el estado de los invocadores
    for (const name of summonerNames) {
        summonerStatus[name] = { inGame: false }; // inGame: false significa que no están en una partida
    }
    const gameCounts = {};
    const notifiedGames = new Map();
    // Función para comprobar si un invocador ha comenzado una partida
    function checkSummonerGame(name) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const summoner = yield api.Summoner.by.name(name);
                if (!summoner || !summoner.id) {
                    console.log(`No se ha encontrado a ${name}`);
                    return;
                }
                let currentGame = null;
                try {
                    currentGame = (yield api.CurrentGame.by.summonerID(summoner.id));
                }
                catch (error) {
                    if (error.statusCode === 404) {
                        // El invocador no está en una partida
                        currentGame = null;
                    }
                    else {
                        // Otro tipo de error (p.ej., problemas de red, límites de tasa, etc.)
                        console.error("Error al obtener el juego actual:", error);
                    }
                }
                console.log({ currentGame: currentGame === null || currentGame === void 0 ? void 0 : currentGame.gameId, summonerStatus: summonerStatus[name] });
                if ((currentGame === null || currentGame === void 0 ? void 0 : currentGame.gameId) && !summonerStatus[name].inGame) {
                    console.log(`${name} ha comenzado una partida!`);
                    summonerStatus[name].inGame = true;
                    summonerStatus[name].gameId = currentGame.gameId;
                    const gameId = currentGame.gameId;
                    // Aumentar el contador para esta partida
                    if (!gameCounts[gameId]) {
                        gameCounts[gameId] = 0;
                    }
                    gameCounts[gameId]++;
                    // Verificar si hay 3 o más jugadores en esta partida
                    if (gameCounts[gameId] >= (Number(process.env.PLAYERS_IN_GAME) || 3) && !notifiedGames.has(gameId)) {
                        const channel = guild.channels.cache.find(ch => ch.id === env_1.default.DISCORD_CHANNEL_ID && ch.type === discord_js_1.ChannelType.GuildText);
                        if (!channel)
                            return console.log('No se ha encontrado el canal');
                        if (channel && channel.isTextBased()) {
                            const filterByTeamId = new Set(currentGame.participants.map(p => p.teamId));
                            const embed = new discord_js_1.EmbedBuilder()
                                .setTitle(`Se esta jugando una partida Scrim!`)
                                .setColor(0x00AE86)
                                .setURL(`https://www.leagueofgraphs.com/es/match/euw/${currentGame.gameId}`)
                                .setDescription(`¡3 o más miembros están en la misma partida! ID de la partida: ${gameId}`)
                                .setFields([
                                { name: 'Equipo 1: ', value: currentGame.participants.map(p => p.teamId === [...filterByTeamId][0] && p.summonerName).join(', ') },
                                { name: 'Equipo 2: ', value: currentGame.participants.map(p => p.teamId === [...filterByTeamId][1] && p.summonerName).join(', ') }
                            ])
                                .setTimestamp();
                            channel.send({ embeds: [embed] });
                        }
                        notifiedGames.set(gameId, Date.now());
                    }
                }
                else if (!currentGame && summonerStatus[name].inGame) {
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
            }
            catch (e) {
                // console.log(e)
            }
        });
    }
    // Establecer un intervalo para comprobar regularmente
    setInterval(() => {
        for (const name of summonerNames) {
            checkSummonerGame(name);
        }
    }, 30000); // Comprobar cada minuto
    const time = 6 * 60 * 60 * 1000;
    setInterval(() => {
        const now = Date.now();
        for (const [gameId, timestamp] of notifiedGames.entries()) {
            if (now - timestamp > time) {
                notifiedGames.delete(gameId);
            }
        }
    }, time); // Revisa cada día, pero puedes ajustar esto según tus necesidades
}));
client.login(process.env.DISCORD_TOKEN);
