import env from "../env";
import { gamesById } from "./checkTeamGames";
import { gameCounts } from "./getLastGame";
import sendMessageToDiscord, { Target } from "./sendMessageToDiscord";

const notifyScrim = async () => {
    const scrim = Object.entries(gameCounts).find(([_k,v]) => v >= Number(env.PLAYERS_IN_GAME) );
    if(!scrim) return;
    const [id] = scrim;
    
    const gameInfo = gamesById[id]
    await sendMessageToDiscord(gameInfo, Target.channel)
    
}
export default notifyScrim;