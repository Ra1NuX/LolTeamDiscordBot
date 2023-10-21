import { SummonerLeagueDto, SummonerV4DTO } from "twisted/dist/models-dto";
import env from "../../env";
import db from "../db";

const saveUser = async (user: SummonerV4DTO&{league: SummonerLeagueDto[]}) => {
    try {

        if (env.NODE_ENV === 'development') {
            return true
        }

        const users = db.collection("users");

        await users.updateOne({ puuid: user.puuid }, { $set: { ...user}}, { upsert: true });
        return true;

    } catch (error) {
        console.log(error)
        return false;
    }
}

export default saveUser;