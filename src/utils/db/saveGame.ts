import { MatchV5DTOs } from "twisted/dist/models-dto";
import env from "../../env";
import db from "../db";

const saveGame = async (game: MatchV5DTOs.MatchDto) => {
  try {
    if(env.NODE_ENV === 'development') {
      return true
    }
    
    const games = db.collection("games");
    const gameExists = await games.findOne({ gameId: game.info.gameId });

    if(gameExists) return false;
    
    await games.insertOne(game.info);
    
    return true;

  } catch(e) {
    console.log(e)
  }
};

export default saveGame;