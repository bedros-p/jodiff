import { diffChars, type ChangeObject } from "diff"
import { parse, Token, TokenType, tokTypes, tokenizer} from "acorn"


// This diff works by normalizing the variables with a list of identifiers from the previous program.

export function jodiff(oldContent:string, newContent:string) {
    // TODO: Implement
    
    if (oldContent == newContent) {
        return []
    }
    const oldIdents : Token[] = []
    // change to use tokenizer
    const oldTree = parse(oldContent, {ecmaVersion:"latest", onToken(token) {
        if (token.type == tokTypes.name){
            oldIdents.push(token)
        }
    },})

    console.log(oldIdents)
    

    const difference = diffChars(oldContent, newContent)
    return difference
}