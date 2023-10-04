import { CurrentGameInfoDTO } from "twisted/dist/models-dto";
import env from "../env";
import MongoClient from "./db";

const saveGame = async (game: CurrentGameInfoDTO) => {
  try {
    if(env.NODE_ENV === 'development') {
      return true
    }
    await MongoClient.connect();
    const db = MongoClient.db("LoLTeamBot");
    const games = db.collection("games");
    const gameExists = await games.findOne({ gameId: game.gameId });
    if(gameExists) return false;
    await games.insertOne(game);
    return true;

  } finally {
    await MongoClient.close();
  } 
};

export default saveGame;