
import { generateStrings } from "./generate-strings.service";
import { handleStrings } from "./handle-strings.service";

export const processComments = content => {

    // const insideStrings = new function(){
    //     let _singleTicks = false;
    //     define(this, "singleTicks", () => _singleTicks, value => {
    //         if (this.doubleTicks || this.specialTicks || (value && this.singleTicks)) {
    //             throw new Error("Cannot start string while in string.");
    //         }
    //         _singleTicks = value;
    //     });

    //     let _doubleTicks = false;
    //     define(this, "doubleTicks", () => _doubleTicks, value => {
    //         if (this.singleTicks || this.specialTicks || (value && this.doubleTicks)) {
    //             throw new Error("Cannot start string while in string.");
    //         }
    //         _doubleTicks = value;
    //     });

    //     let _specialTicks = false;
    //     define(this, "specialTicks", () => _specialTicks, value => {
    //         if (this.singleTicks || this.doubleTicks || (value && this.specialTicks)) {
    //             throw new Error("Cannot start string while in string.");
    //         }
    //         _specialTicks = value;
    //     });

    //     get(this, "inAString", () => this.singleTicks || this.doubleTicks || this.specialTicks);
    // }

    const stringStore = generateStrings();

    let outputStr = '';
    let i = 0;
    const contentLength = content.length;

    let insideDill = false;

    let parenthesisCount = 0;

    let dillParenthesis = null;

    while (i < contentLength) {
        const character = content.charAt(i);
        const characterBefore = content.charAt(i - 1);

/* Handle strings */
        // if (character === "'" && stringStore.singleTicks && characterBefore !== "/") {
        //     stringStore.singleTicks = false;
        // }
        // else if (character === "'" && !stringStore.singleTicks) {
        //     stringStore.singleTicks = true;
        // }

        // if (character === '"' && stringStore.doubleTicks && characterBefore !== "/") {
        //     stringStore.doubleTicks = false;
        // }
        // else if (character === '"' && !stringStore.doubleTicks) {
        //     stringStore.doubleTicks = true;
        // }

        // if (character === "`" && stringStore.specialTicks && characterBefore !== "/") {
        //     stringStore.specialTicks = false;
        // }
        // else if (character === "`" && !stringStore.specialTicks) {
        //     stringStore.specialTicks = true;
        // }

        handleStrings(stringStore, character, characterBefore);




/* Remove comments */
        if (content.substr(i, 2) === "//" && !stringStore.inAString) {
            i += content.substr(i).indexOf("\n");
            continue;
        }
        if (content.substr(i, 2) === "/*" && !stringStore.inAString) {
            i += content.substr(i).indexOf("*/") + 2;
            continue;
        }
        if (insideDill && content.substr(i, 3) === "{/*" && !stringStore.inAString) {
            i += content.substr(i).indexOf("*/}") + 3;
            continue;
        }




        if (content.substr(i, 5) === "dill(" && !stringStore.inAString && !insideDill) {
            dillParenthesis = parenthesisCount;
            insideDill = true;
            parenthesisCount++;
            outputStr += 'dill(';
            i += 5;
            continue;
        }
        if (character === ")") {
            parenthesisCount--;
        }
        if (dillParenthesis === parenthesisCount) {
            dillParenthesis = null;
            insideDill = false;
        }

        outputStr += character;
        i++;
    }

    return outputStr;
}
