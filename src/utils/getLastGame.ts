import env from "../env";
import { Constants, LolApi } from "twisted";
import saveGame from "./db/saveGame";
import saveUser from "./db/saveUser";
import sendMessageToDiscord, { Target } from "./sendMessageToDiscord";

export let gameCounts: {[x:string]: number} = {} 

const getLastGame = async (name: string) => {
    try {
        const api = new LolApi({ key: env.RIOT_API_KEY, rateLimitRetry: true, rateLimitRetryAttempts: 3, concurrency: undefined });
        const { response: summoner } = await api.Summoner.getByName(name, Constants.Regions.EU_WEST);
        const { response: leagueV4 } = await api.League.bySummoner(summoner.id, Constants.Regions.EU_WEST)
        
        if ((!summoner || !summoner.id) && (!leagueV4  ) ) return null;
        await saveUser({...summoner, ...leagueV4});
        
        const { response: [lastGameID] } = await api.MatchV5.list(summoner.puuid, Constants.RegionGroups.EUROPE, { count: 1, queue: 420 });
        gameCounts[lastGameID] += 1
        const lastGame = (await api.MatchV5.get(lastGameID, Constants.RegionGroups.EUROPE)).response
        
        const isCreated = await saveGame(lastGame, summoner.puuid);

        if (!isCreated) {
            return null
        }

        await sendMessageToDiscord(lastGame.info, Target.user, name)

        return lastGame.info;
    } catch (e) {
        // console.log(e)
    }

}

export default getLastGame;