import { MatchV5DTOs } from "twisted/dist/models-dto"

export interface SummonerStatus { 
    [name: string]: { 
        inGame: boolean, 
        gameId?: number 
    } 
}

export interface GameCounts { 
    [gameId: string]: number 
}

export interface GameInfo {
    [gameId: string]: MatchV5DTOs.InfoDto
}