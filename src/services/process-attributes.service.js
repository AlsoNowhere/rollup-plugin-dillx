
import { generateStrings } from "./generate-strings.service";
import { handleStrings } from "./handle-strings.service";

const notInAttributeName = ['"', "'", "\n", "\r", "\t"];

export const processAttributes = (content, name) => {
    const obj = {};
    if (content === null) {
        return JSON.stringify(obj);
    }

    if (content.charAt(content.length - 1) === "/") {
        content = content.substring(0, content.length - 1);
    }

    if (content === "") {
        return "null";
    }

    let attributeName = null;
    let attributeValue = null;
    let i = 0;
    const stringStore = generateStrings();

    {
        const contentLength = content.length;
        while (i < contentLength) {
            const character = content.charAt(i);
            const characterBefore = content.charAt(i - 1);

            handleStrings(character, characterBefore, stringStore);

            if (stringStore.inAString) {
                if ((stringStore.double && character !== '"') && attributeValue !== null) {
                    attributeValue += character;
                }
                i++;
                continue;
            }
            if (character === "=") {
                attributeValue === null && (attributeValue = "");
                i++;
                continue;
            }
            if (character === " "){
                if (attributeName === null && attributeValue === null) {
                    i++;
                    continue;
                }
                if (attributeValue === null) {
                    obj[attributeName] = "";
                    attributeName = null;
                    i++;
                    continue;
                }
                obj[attributeName] = attributeValue;
                attributeName = null;
                attributeValue = null;
                i++;
                continue;
            }
            else if (!notInAttributeName.includes(character)) {
                attributeName === null && (attributeName = "");
                attributeName += character;
            }
            i++;
        }
    }

    if (attributeName !== null) {
        obj[attributeName] = attributeValue || "";
    }

    // console.log("Attributes: ", obj);

    return JSON.stringify(obj);
}
