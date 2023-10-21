import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.string().default('development'),
    PORT: z.string().default('3000'),
    DISCORD_TOKEN: z.string(),
    RIOT_API_KEY: z.string(),
    PLAYERS_IN_GAME: z.string().default("3"),
    DISCORD_ROLE_NAME: z.string(),
    DISCORD_CHANNEL_ID: z.string(),
    DISCORD_SERVER_ID: z.string(),
    DB_URI: z.string(),
    DB_NAME: z.string().default('LolTeamBot'),
    MINUTES: z.string().default('15'),
    LOCAL_USERNAME: z.string().optional()
});

const env = envSchema.parse(process.env);

export default env;
