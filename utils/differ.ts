import { diffChars, type ChangeObject } from "diff"
import { parse, Token, TokenType, tokTypes, tokenizer} from "acorn"


// This diff works by normalizing the variables with a list of identifiers from the previous program.

export function jodiff(oldContent:string, newContent:string) {
    // TODO: Implement
    
    if (oldContent == newContent) {
        return []
    }

    // const oldIdents : Token[] = []
    // change to use tokenizer

    const tok = tokenizer(oldContent, {ecmaVersion:"latest"})
    
    // Need to create a mapping of variables from new to old
    const idents = Array.from(tok, (v)=>v.type == tokTypes.name ? oldContent.slice(v.start, v.end) : undefined).filter((val)=>val != undefined)
    // const tokArray = Array.from(tok, (v, k)=>)
    
    var program = ""
    // var i = 0

    // const oldTree = parse(oldContent, {ecmaVersion:"latest", onToken(token) {
    //     if (token.type == tokTypes.name){
    //         program+=idents.at(i++)
    //     } else {
    //         program+= oldContent.slice(token.start, token.end)
    //     }
    // },})

    // console.log(idents)

    const difference = diffChars(oldContent, program)
    return difference
}