import { parse } from "acorn"

import { sleepSync, spawnSync, stderr, file} from "bun";

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { getContent } from "./utils/network";
import { jodiff } from "./utils/differ";

import {enable} from "colors";
enable()

var program = yargs(hideBin(Bun.argv));
program = program.command("custom [command] [type] [interval] [runImmediately]", "Run a shell command at an interval for obtaining the URLs. Use when your script URLs are dynamically obtained.", (yarg)=>{
        return yarg.positional("command", {
            type: "string",
            describe: "Shell command to run. Must write result to stdout."
        }).demandOption("command").positional("type", {
            choices: ["url", "content"],
            desc: "What the command outputs - script URL (url) or script contents (content). URL as default.",
            default: "url"
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
                cmd: customArgs.command!.split(" "),
                stdout: "pipe",
            })
            
            if (spawnResult.stderr.length > 0) {
                const err = new Error(spawnResult.stderr.toString(), {cause:"Shell script wrote to stderr, terminating."})
                console.error(err)

            } else if (!spawnResult.success) {
                console.log("FACK!")
                return program.exit(-1, new Error("Spawn not successful.", {cause:"Shell script wouldn't start, terminating."}))
            }
            
            const stdContent = spawnResult.stdout.toString()
            console.log("s")

            var content;
            if (customArgs.type == "content") {
                content = stdContent
            } else {
                content = await getContent(stdContent).catch((rej)=>{
                    return program.exit(-1, rej as Error)
                })
            }

            console.log("s")

            oldContent ??= content!

            jodiff(oldContent, content!) // if equal it'll be skipped anyways
            sleepSync(customArgs.interval * 1000)
        }
        
    }).command("compare [oldFile] [newFile]", "Compare two files.", (yarg)=>{
        return yarg.positional("oldFile", {
            type: "string",
            desc:"Relative position of the first file.",
            demandOption: "You must include both files."
        }).positional("newFile", {
            type: "string",
            desc:"Relative position of the second (new) file.",
            demandOption: "You must include a file to compare with."
        })
    }, async (customArgs)=>{

        const firstFile = await file(customArgs.oldFile).text()
        const secondFile = await file(customArgs.newFile).text()

        const difference = jodiff(firstFile, secondFile)

        difference.forEach((part) => {
            let text = part.added ? part.value.bgGreen :
                part.removed ? part.value.bgRed :
                part.value;
        process.stderr.write(text);
    });
    }).command("combine [oldFile] [newFile] [outFile]", "Get a version of the new file with only new variables containing updated names.", (yarg)=>{
        // TODO: Implement

    });

program.strict().demandCommand(1).parse()


// jodiff -s custom.js -t 60 s
// jodiff --old=first.js --new=second.js
