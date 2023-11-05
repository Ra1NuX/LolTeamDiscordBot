import { MatchV5DTOs, SummonerLeagueDto } from "twisted/dist/models-dto"

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

export interface Stats {
    puuid: string;
    Date: Date;
    Rankeds: SummonerLeagueDto[];
    Games: string[];
}
