
import getSummonerNames from './getSummonerNames';
import checkTeamGames from './checkTeamGames';
import env from '../env';
import notifyScrim from './notifyScrim';
import clean from './clean';
import db, { mongoClient } from './db';


const start = async () => {
    console.log('Client is ready!');

    try {

        let time = (Number(env.MINUTES) * 60 * 1000);
        if (env.NODE_ENV === 'development') time = 15000;

        console.log(`Check each ${time / 1000} seconds`)

        setInterval(async () => {
            console.log('Starting analize');
            let summonerNames
            if (env.LOCAL_USERNAME) {
                summonerNames = [env.LOCAL_USERNAME]
            } else {
                summonerNames = await getSummonerNames()
            }

            console.log('Nombres a analizar: ', summonerNames.join(', '))

            for await (const name of summonerNames) {
                await checkTeamGames(name);
            }

            await notifyScrim()
            clean()

        }, time);

    } catch (e) {
        console.log(e)
    } finally {
        mongoClient.close();
    }
};

export default start;