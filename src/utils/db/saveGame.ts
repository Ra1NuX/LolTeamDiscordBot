import { MatchV5DTOs, SummonerV4DTO } from "twisted/dist/models-dto";
import env from "../../env";
import { gamesById } from "../checkTeamGames";
import db from "../db";
import revalidate from "../revalidate";

const saveGame = async (game: MatchV5DTOs.MatchDto, summoner: SummonerV4DTO) => {
  try {
    if(env.NODE_ENV === 'development') {
      return true
    }
    
    const games = db.collection("games");
    const users = db.collection('users');

    const gameExists = await games.findOne({ gameId: game.info.gameId });

    const ids = Object.keys(gamesById);
    const isDuo = ids.includes(game.info.gameId.toString())

    if(isDuo) {
      await users.updateOne({puuid: summoner.puuid}, {$push: { games: game.info.gameId }})
      return true;
    }

    if(gameExists) return false;
    
    await games.insertOne(game.info);
    await revalidate(summoner.name);

    return true;

  } catch(e) {
    console.log(e)
  }
};

export default saveGame;