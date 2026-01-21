import { diffChars, type ChangeObject } from "diff"


// This diff works by normalizing the variables with a list of identifiers from the previous program.

export function jodiff(oldContent:string, newContent:string) {
    // TODO: Implement
    
    if (oldContent == newContent) {
        return []
    }

    const difference = diffChars(oldContent, newContent)

    return difference
}