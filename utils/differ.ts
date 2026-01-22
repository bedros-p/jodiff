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
    var idents : Token[] = []
    var normalizedOld = ""
    parse(oldContent, {ecmaVersion:"latest", onToken(token) {
        normalizedOld += oldContent.slice(token.start, token.end)
        if (token.type == tokTypes.name){
            idents.push((token as any).value)
        }

        if (token.type.keyword != undefined) {
            normalizedOld += " "
        }
    }, onInsertedSemicolon(token) {
        normalizedOld += "\n"
    }})

    var program = ""
    var i = 0
    
    const newModei = parse(newContent, {ecmaVersion:"latest", onToken(token) {
        if (token.type == tokTypes.name){
            program+=idents.at(i)
            i++
        } else {
            program+= newContent.slice(token.start, token.end)
        }
        if (token.type.keyword != undefined) {
            program += " "
        }
    }, onInsertedSemicolon(token) {
        program += "\n"
    }})

    // console.log(newModei, "-------\n\n\n\n\n")
    console.log(normalizedOld, "-------\n\n\n\n\n")
    console.log(program, "-------\n\n\n\n\n")

    const difference = diffChars(normalizedOld, program)
    return difference
}