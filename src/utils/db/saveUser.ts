import { SummonerV4DTO } from "twisted/dist/models-dto";
import env from "../../env";
import db from "../db";
import MongoClient from '../db'

const saveUser = async (user: SummonerV4DTO, lastGameID: string) => {
    if (env.NODE_ENV === 'development') {
        return true
    }

    const users = db.collection("users");
    const selectedUser = await users.findOne<SummonerV4DTO>({ puuid: user.puuid });
    
    if(selectedUser && selectedUser.revisionDate === user.revisionDate) {
        await users.updateOne({puuid: user.puuid}, { $push: {games: lastGameID }})
        return false;
    }

    await users.updateOne({puuid: user.puuid}, {...user, $push: { games: lastGameID } });
    return true;
}

export default saveUser;