import { SummonerV4DTO } from "twisted/dist/models-dto";
import env from "../../env";
import db from "../db";
import MongoClient from '../db'

const saveUser = async (user: SummonerV4DTO, lastGameID: string) => {
    try {

        if (env.NODE_ENV === 'development') {
            return true
        }

        const users = db.collection("users");
        const selectedUser = await users.findOne<SummonerV4DTO>({ puuid: user.puuid });

        console.log({ selectedUser })

        if (selectedUser && selectedUser.revisionDate === user.revisionDate) {
            console.log('se ha guardado una partida en un usuario')
            await users.updateOne({ puuid: user.puuid }, { $push: { games: lastGameID } })
            return false;
        }

        await users.insertOne({...user, games: [lastGameID]});
        return true;
    } catch (error) {
        console.log(error)
    }
}

export default saveUser;