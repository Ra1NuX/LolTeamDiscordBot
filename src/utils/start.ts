import { Client } from 'discord.js';
import getSummonerNames from './getSummonerNames';
import checkTeamGames from './checkTeamGames';


const start = async (client: Client) => {
    console.log('Client is ready!');

    try {
        const summonerNames = await getSummonerNames(client);

        for await (const name of summonerNames) {
            await checkTeamGames(name, client);
        }

    } catch (e) {
        console.log(e)
    } finally{
        client.destroy();
        process.exit(0)
    }
};

export default start;