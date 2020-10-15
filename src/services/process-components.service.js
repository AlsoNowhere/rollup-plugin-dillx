
import { handleStrings } from "./handle-strings.service";
import { generateStrings } from "./generate-strings.service";

export const processComponents = (content, name) => {

    let outputStr = '';
    let i = 0;

    let componentName = null;

    let insideConstructorFunction = false;
/* Depth of brace bracket. */
    let braceCount = 0;
    let constructorBraceCount = null;

    let insideTemplate = false;
/* Depth of parenthesis. */
    let parenthesisCount = 0;
    let templateParenthesisCount = null;

/* Indexes */
    let templateStart = null;
    let templateEnd = null;

    const stringStore = generateStrings();

    {
        const contentLength = content.length;
        while (i < contentLength) {
            const character = content.charAt(i);
            const characterBefore = content.charAt(i - 1);

            handleStrings(character, characterBefore, stringStore);

    /* If we're in a string then add this character and continue. Unless we're inside a template */
            if (stringStore.inAString) {
                if (!insideTemplate) {
                    outputStr += character;
                }
                i++;
                continue;
            }

    /* Detect if this is declaring a new constructor function e.g const Melon. */
            if (content.substr(i, 7).match(/const [A-Z]{1}/)) {
                insideConstructorFunction = true;
                constructorBraceCount = braceCount;
                componentName = content.substr(i + 6, content.substr(i + 6).indexOf(" "));
            }

    /* Detect if we are at the start of a Component template. */
            if (insideConstructorFunction && content.substr(i, 12) === "return dill(") {
                templateStart = i + 12;
                insideTemplate = true;
                templateParenthesisCount = parenthesisCount;
                parenthesisCount++;
                i += 12;
                continue;
            }

    /* Increment depths. */
            character === "}" && braceCount--;
            character === "{" && braceCount++;
            character === ")" && parenthesisCount--;
            character === "(" && parenthesisCount++;

    /* Detect if at the closing parenthesis of a template. */
            if (insideTemplate && character === ")" && templateParenthesisCount === parenthesisCount) {
                insideTemplate = false;
                templateEnd = i;
                templateParenthesisCount = null;
                i++;
                continue;
            }

    /* Detect if at the closing brace of a constructor function. */
            if (insideConstructorFunction && character === "}" && braceCount === constructorBraceCount) {
                insideConstructorFunction = false;
                constructorBraceCount = null;
                outputStr += character;
                i++;

        /* If we have a template ready then add this line after the Component. */
                if (templateStart !== null && templateEnd !== null) {
                    outputStr += `\n${componentName}.component = new dill.Component(${content.substring(templateStart, templateEnd)});`;
                    templateStart = null;
                    templateEnd = null;
                }
                componentName = null;
                continue;
            }
            if (insideTemplate) {
                i++;
                continue;
            }

            outputStr += character;
            i++;
        }
    }

    return outputStr;
}
