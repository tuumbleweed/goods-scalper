import * as fs from "fs";
import dotenv from "dotenv";


export function readEnvVars(): string {
    let dotenvConfigPath: string;
    if (fs.existsSync(".env")) {
        dotenvConfigPath = ".env";
    } else {
        dotenvConfigPath = ".env.example"; // you can delete this after you create your own .env file!
    }
    dotenv.config({ path: dotenvConfigPath });

    return dotenvConfigPath;
}

export default readEnvVars();