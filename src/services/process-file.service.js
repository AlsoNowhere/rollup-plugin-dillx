
import { processJSX } from "./process-jsx.service";
import { handleStrings } from "./handle-strings.service";
import { generateStrings } from "./generate-strings.service";

export const processFile = (content, name) => {

    const stringStore = generateStrings();

    let outputStr = '';
    let i = 0;

    let insideDill = false;

    let dillStartIndex = null;

    let parenthesisCount = 0;
    let dillParenthesis = null;
    let hasReturn = false;

    {
        const contentLength = content.length;
        while (i < contentLength) {
            const character = content.charAt(i);
            const characterBefore = content.charAt(i - 1);

            if (!insideDill) {
                handleStrings(character, characterBefore, stringStore);
            }

        /* The start of some dill JSX. */
            if (!stringStore.inAString
                    && content.substr(i, 5) === "dill(" && !insideDill) {
                dillParenthesis = parenthesisCount;
                insideDill = true;
                dillStartIndex = i;
                parenthesisCount++;

            /*
                Capture if this has a return statement before it.
                If yes then this JSX is for a Component.
                Component JSX will retain the dill() surround so that the Component can be parsed correctly later.
            */
                if (content.substr(i - 7, 7) === "return ") {
                    outputStr += 'dill(';
                    hasReturn = true;
                }
                i += 7;
                continue;
            }

            if (character === ")") {
                parenthesisCount--;
            }

        /* Get to the end of the JSX. */
            if (dillParenthesis === parenthesisCount) {
                dillParenthesis = null;
                insideDill = false;
                outputStr += processJSX(content.substring(dillStartIndex + 5, i), name);
                dillStartIndex = null;
                if (hasReturn) {
                    outputStr += character;
                    hasReturn = false;
                }
                i++;
                continue;
            }

            if (insideDill) {
                i++;
                continue;
            }

            outputStr += character;
            i++;
        }
    }

    return outputStr;
}
