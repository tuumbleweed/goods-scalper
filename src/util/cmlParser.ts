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