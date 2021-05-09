import * as error from "./util/error";
import { stopExecution } from "./lib/tools";

/**
 * Launch chosen script. Should return 0 on success.
 */
async function launchScript(): Promise<number> {
    // import and execute the script
    let script: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    const scriptName = process.argv[2];
    try {
        script = (await import(`./script/${scriptName}`)).default;
    } catch (err) {
        throw new error.CannotImportScript(scriptName);
    }
    return await script();
}

async function main(): Promise<void> {
    try {
        const result = await launchScript();
        await stopExecution(result);
    } catch (err) {
        await error.handleError(err);
    }
}

main();