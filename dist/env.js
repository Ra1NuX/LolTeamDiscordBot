"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.string().default('development'),
    PORT: zod_1.z.string().default('3000'),
    DISCORD_TOKEN: zod_1.z.string(),
    RIOT_API_KEY: zod_1.z.string(),
    PLAYERS_IN_GAME: zod_1.z.number().default(3),
    DISCORD_ROLE_NAME: zod_1.z.string(),
    DISCORD_CHANNEL_ID: zod_1.z.string(),
    DISCORD_SERVER_ID: zod_1.z.string(),
});
const env = envSchema.parse(process.env);
exports.default = env;
