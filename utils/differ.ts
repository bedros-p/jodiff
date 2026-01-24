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
    
    var idents : string[] = []
    var newIdents : string[] = []
    var normalizedOld = ""
    let i = 0 
    parse(oldContent, {ecmaVersion:"latest", onToken(token) {
        if (token.type == tokTypes.name){
            normalizedOld += "v"+i++
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
    parse(newContent, {ecmaVersion: "latest", onToken(token){
        // tokValue = newContent.slice(token.start, token.end)
        // program += newContent.slice(token.start, token.end)
        if (token.type == tokTypes.name){
            program += "v"+i++
        } else {
            program += newContent.slice(token.start, token.end)
        }

        if (token.type.keyword != undefined) {
            program += " "
        }
    }, onInsertedSemicolon(token) {
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