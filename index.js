import { getEnv } from "./utils/dotenv.js";

const env = await getEnv();

console.log(env);