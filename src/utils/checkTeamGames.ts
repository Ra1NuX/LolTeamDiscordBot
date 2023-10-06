
import { GameInfo } from "../models/lol";
import getLastGame from "./getLastGame";

export const gamesById: GameInfo = {};

const checkTeamGames = async (name: string) => {
    try {
        const lastGame = await getLastGame(name);
        if (!lastGame?.gameId) return;

        const { gameId } = lastGame
        console.log('Ultimo game jugado: ', gameId)
        
        gamesById[gameId] = lastGame
    } catch (e) {
        console.log(e)
    }
}

export default checkTeamGames;