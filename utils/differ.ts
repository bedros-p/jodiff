import { diffChars, type ChangeObject } from "diff"
import { parse, Token, TokenType, tokTypes, tokenizer} from "acorn"


// Occurence
export function jodiff(oldContent:string, newContent:string) {
    // TODO: Implement
    
    if (oldContent == newContent) {
        return []
    }

    // const oldIdents : Token[] = []
    // change to use tokenizer

    const tok = tokenizer(oldContent, {ecmaVersion:"latest"})
    
    var normalizedOld = ""
    let i = 0 
    const oldMapping : {[ident : string] : string} = {}
    parse(oldContent, {ecmaVersion:"latest", onToken(token) {
        if (token.type == tokTypes.name){
            oldMapping[(token as any).value] ??= "v"+i++
            normalizedOld += oldMapping[(token as any).value]
        } else {
            normalizedOld += oldContent.slice(token.start, token.end)
        }

        if (token.type.keyword != undefined) {
            normalizedOld += " "
        }
    }, onInsertedSemicolon(token) {
        normalizedOld += "\n"
    }})

    var program = ""
    i = 0;    
    let indexStart = 0
    let statementStart = 0

    const newMapping : {[ident : string] : string} = {}
    parse(newContent, {ecmaVersion: "latest", onToken(token){
        // tokValue = newContent.slice(token.start, token.end)
        // program += newContent.slice(token.start, token.end)
        
        if (token.type == tokTypes.name){
            newMapping[(token as any).value] ??= "v"+indexStart++
            // let ident = newMapping[(token as any).value]
            // if (ident != normalizedOld.slice(token.start, token.end)){
                // ident
            // }
            program += newMapping[(token as any).value]
        } else {
            program += newContent.slice(token.start, token.end)
        }

        if (token.type.keyword != undefined) {
            program += " "
        }

        // if (program.slice(token.start, token.end) != normalizedOld.slice(token.start, token.end)){
        //     if (token.type == tokTypes.name){
        //         newMapping[(token as any).value] ??= "_v"+indexStart++
        //         program += newMapping[(token as any).value]
        //     }
        // }
        
    }, onInsertedSemicolon(lastTokEnd) {
        // const newStatement = program.slice(statementStart, lastTokEnd)
        // const oldStatement = normalizedOld.slice(statementStart, lastTokEnd)

        // if (newStatement != oldStatement) {
        //     indexStart = i
        // } else {
        //     i = indexStart  
        // }
        // // statementStart = 
        // statementStart = lastTokEnd
        program += "\n"
    }})

    // Pass for algorithm stuff

    // console.log(idents, "\n\n-------\n\n")
    // console.log(newIdents, "\n\n-------\n\n")

    // const oldOccurences : {[ident : string] : number[]} = {}
    // const newOccurences : {[ident : string] : number[]} = {}

    // // optimization comes later
    // idents.forEach((item, i)=>{
    //     if (oldOccurences[item] == undefined) oldOccurences[item] = [];
    //     oldOccurences[item].push(i)
    // })

    // newIdents.forEach((item, i)=>{
    //     if (newOccurences[item] == undefined) newOccurences[item] = [];
    //     newOccurences[item].push(i)
    // })

    // console.log(newOccurences, oldOccurences)

    // console.log(newModei, "-------\n\n\n\n\n")
    console.log(normalizedOld, "-------\n\n\n\n\n")
    console.log(program, "-------\n\n\n\n\n")

    const difference = diffChars(normalizedOld, program)
    return difference
}