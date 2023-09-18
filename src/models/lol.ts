export interface SummonerStatus { 
    [name: string]: { 
        inGame: boolean, 
        gameId?: number 
    } 
}

export interface GameCounts { 
    [gameId: string]: number 
}