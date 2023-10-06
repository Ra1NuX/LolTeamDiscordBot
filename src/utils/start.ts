import { Client } from 'discord.js';
import getSummonerNames from './getSummonerNames';
import checkTeamGames from './checkTeamGames';
import MongoClient from "./db";
import env from '../env';
import notifyScrim from './notifyScrim';
import clean from './clean';


const start = async () => {
    console.log('Client is ready!');

    try {

        let time = (Number(env.MINUTES) * 60 * 1000);
        if (env.NODE_ENV === 'development') time = 15000;

        console.log(`Check each ${time / 1000} seconds`)
        await MongoClient.connect();

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
        MongoClient.close();
    }
};

export default start;