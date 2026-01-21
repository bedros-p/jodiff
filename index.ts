import { parse } from "acorn"

import { sleepSync, spawnSync, stderr } from "bun";

import yargs, { exit } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { getContent } from "./utils/network";
import { jodiff } from "./utils/differ";

var hasRun = false

yargs(hideBin(process.argv))
    .command("custom", "Run a custom script at an interval for obtaining the URLs. Use when your script URLs are dynamically obtained.", (yarg)=>{
        return yarg.positional("script", {
            type: "string",
            describe: "Shell command to run. Must write the obtained script URL / script content to stdout. Use ."
        }).positional("type", {
            choices: ["url", "content"],
            desc: "Type of script output - script URL (url) or script contents (content). "
        }).positional("interval", {
            desc: "Interval to run the script, in seconds.",
            type : "number",
            default: 60
        }).positional("runImmediately", {
            desc: "Immediately start running the script, followed by running it at intervals.",
            type: "boolean",
            default: true
        })
    }, async (customArgs)=>{
        if (!customArgs.runImmediately) {sleepSync(customArgs.interval * 1000)}

        var oldContent = ""
        while (true) {
            const spawnResult = spawnSync({
                cmd: [customArgs.script!],
                stdout: "pipe"
            })
            
            if (spawnResult.stderr) {
                return exit(-1, new Error(spawnResult.stderr.toString(), {cause:"Shell script wrote to stderr, terminating."}))
            } else if (!spawnResult.success) {
                return exit(-1, new Error("Spawn not successful.", {cause:"Shell script wouldn't start, terminating."}))
            }
            
            const stdContent = spawnResult.stdout.toString()
            var content;
            if (customArgs.type == "content") {
                content = stdContent
            } else {
                content = await getContent(stdContent).catch((rej)=>{
                    return exit(-1, rej as Error)
                })
            }

            oldContent ??= content!

            jodiff(oldContent, content!) // if equal it'll be skipped anyways
        }
        
    }).command("compare [oldFile] [newFile]", "Compare two files.", (yarg)=>{
        // TODO: Implement
        return yarg.positional("oldFile", {
            type: "string"
        })
    }).command("combine [oldFile] [newFile] [outFile]", "Get a version of the new file with only new variables containing updated names.", (yarg)=>{
        // TODO: Implement

    })
    .parse()

// jodiff -s custom.js -t 60 s
// jodiff --old=first.js --new=second.js
