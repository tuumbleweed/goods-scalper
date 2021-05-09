import commander, { CommanderStatic } from "commander";


export function getCmdArgs(): CommanderStatic {
    commander.version(process.env.npm_package_version);
    commander.usage("-- [options]");

    const script = process.argv[2];
    switch (script) {
        case "api":
            commander.name("api");
            commander.option("-p --port [text]", "API port", "3000");
            commander.option("-i --instance [text]", "Instance Name", "api");
            break;
        case "scalp-all":
            commander.name("scalp-all");
            commander.option("-k --keep", "Keep browser open after task is finished", false);
            commander.option("-h --headless", "Launch browser in headless mode", false);
            commander.option("-b --browser [text]", "chromium, firefox or webkit", "chromium");
            commander.option("--incognito", "Launch browser in incognito mode", false);
            commander.option("-i --instance [text]", "Instance Name", "scalp-all");
            break;
        case "example1":
            commander.name("example1");
            commander.option("-n --number [number]", "Number", "20");
            commander.option("-i --instance [text]", "Instance Name", "example1");
    }
    commander.option("-d --docker", "Running inside docker container", false);
    commander.parse(process.argv);

    return commander;
}

const cmdArgs = getCmdArgs();
export default cmdArgs;