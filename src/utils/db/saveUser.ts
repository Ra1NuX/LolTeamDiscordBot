import { SummonerV4DTO } from "twisted/dist/models-dto";
import env from "../../env";
import db from "../db";

const saveUser = async (user: SummonerV4DTO) => {
    try {

        if (env.NODE_ENV === 'development') {
            return true
        }

        const users = db.collection("users");
        const selectedUser = await users.findOne<SummonerV4DTO>({ puuid: user.puuid });

        if (selectedUser && selectedUser.revisionDate === user.revisionDate) {
            return false;
        }

        await users.updateOne({ puuid: user.puuid }, { $set: { ...user}}, { upsert: true });
        return true;

    } catch (error) {
        console.log(error)
    }
}

export default saveUser;