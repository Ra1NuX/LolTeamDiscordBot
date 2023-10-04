import { Constants, LolApi } from "twisted";
import { ApiResponseDTO, CurrentGameInfoDTO } from "twisted/dist/models-dto";
import saveGame from "./saveGame";
import env from "../env";
import { GameModes } from "twisted/dist/constants";
import getDiscordClient from "./getDiscordClient";
import sendMessageToDiscord, { Target } from "./sendMessageToDiscord";

const getActiveGame = async (name: string) => {
    try {
        const client = getDiscordClient();
        const api = new LolApi({ key: env.RIOT_API_KEY, rateLimitRetry: true, rateLimitRetryAttempts: 3, concurrency: undefined });
        const { response: summoner } = await api.Summoner.getByName(name, Constants.Regions.EU_WEST);
        
        if (!summoner || !summoner.id) return null;

        let activeGame: ApiResponseDTO<CurrentGameInfoDTO>;
        try {
            activeGame = await api.Spectator.activeGame(summoner.id, Constants.Regions.EU_WEST) as ApiResponseDTO<CurrentGameInfoDTO>;
        } catch(e) {
            console.log(`El invocador ${name} no esta activo`);
            return null;
        }

        if(activeGame.response.gameMode !== GameModes.CLASSIC) {
            return null;
        }
        
        const isCreated = await saveGame(activeGame?.response);
        
        if (!isCreated) {
            console.log(`El invocador ${name} sigue en partida`);
            return null
        } 

        await sendMessageToDiscord(activeGame.response, Target.user, name)
        
        return activeGame?.response;
    } catch (e) {
        // console.log(e)
    }

}

export default getActiveGame;