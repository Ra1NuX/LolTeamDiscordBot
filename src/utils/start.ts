import { Client } from 'discord.js';
import cron from 'node-cron';
import getSummonerNames from './getSummonerNames';
import checkTeamGames from './checkTeamGames';


const start = async (client: Client) => {
    cron.schedule('*/15 * * * *', async () => {
        console.log('Client is ready!');
        try {
            const summonerNames = await getSummonerNames(client);

            for await (const name of summonerNames) {
                await checkTeamGames(name, client);
            }

        } catch (e) {
            console.log(e)
        }
    }, {scheduled: true, timezone: "Europe/Madrid"})
};

export default start;