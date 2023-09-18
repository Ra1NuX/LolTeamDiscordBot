import { Client } from "discord.js";
import env from "../env";
import { GameCounts } from "../models/lol";
import getActiveGame from "./getActiveGame";
import sendMessageToDiscord from "./sendMessageToDiscord";

const gameCounts: GameCounts = {};

const checkTeamGames = async (name: string, client: Client) => {
    try {
        
        const currentGame = await getActiveGame(name);
        if (!currentGame?.gameId) return;

        console.log(`${name} esta en una partida!`);
        const gameId = currentGame.gameId!;

        // Aumentar el contador para esta partida
        if (!gameCounts[gameId]) {
            gameCounts[gameId] = 0;
        }
        gameCounts[gameId]++;

        // Verificar si hay 3 o más jugadores en esta partida
        if (gameCounts[gameId] >= (Number(env.PLAYERS_IN_GAME))) {
            await sendMessageToDiscord(currentGame, client);
        }

    } catch (e) {
        console.log(e)
    }
}

export default checkTeamGames;