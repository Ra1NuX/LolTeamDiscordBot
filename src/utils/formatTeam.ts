import { getChampionNameCapital } from "twisted/dist/constants";
import { MatchV5DTOs } from "twisted/dist/models-dto";

const formatTeam = (currentGame: MatchV5DTOs.InfoDto) => {
    
    const { participants } = currentGame;

    const team1 = [];
    const team2 = [];

    const teamIds = Array.from(new Set<number>(participants.map(p => p.teamId!)));

    for(let i = 0; i<participants.length;i++) {
        const participant = participants[i];
        if(participant.teamId === teamIds[0]) {
            team1.push(participant)
        } else if(participant.teamId === teamIds[1]) {
            team2.push(participant)
        }
    }

    const formatedTeam1 = team1.map(participant => `- **${getChampionNameCapital(participant.championId)}** (${participant.kills}/${participant.deaths}/${participant.assists}) \n ${participant.summonerName}`)
    const formatedTeam2 = team2.map(participant => `- **${getChampionNameCapital(participant.championId)}** (${participant.kills}/${participant.deaths}/${participant.assists}) \n ${participant.summonerName}`)

    return { team1: formatedTeam1.join('\n'), team2: formatedTeam2.join('\n') }

}

export default formatTeam;