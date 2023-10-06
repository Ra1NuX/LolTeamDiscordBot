import { gamesById } from "./checkTeamGames";
import { gameCounts } from "./getLastGame";

const clean = () => {

    Object.keys(gameCounts).forEach(e => {
        delete gameCounts[e];
    })

    console.log('limpieza de gameCounts completada:', gameCounts);
    
    Object.keys(gamesById).forEach(e => {
        delete gamesById[e]
    })
    console.log('limpieza de gamesById completada:', gamesById);
    
}

export default clean; 