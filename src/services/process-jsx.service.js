
import { processElement } from "./process-element.service";

export const processJSX = (content, name) => {

    let outputStr = '';
    let i = 0;

    let textNode = false;

    // console.log("JSX in: ", content);
    // console.log("===");

    {
        const contentLength = content.length;
        while (i < contentLength) {
            const character = content.charAt(i);
            const characterAfter = content.charAt(i + 1);

            if (character === "<") {

                if (textNode) {
                    outputStr += '"],';
                    textNode = false;
                }

            /* Process if closing fragment tab (</>). */
                if (characterAfter === "/" && content.charAt(i + 2) === ">") {
                    outputStr += "]";
                    i += 3;
                    continue;
                }

            /* Process if fragment tab (<>). */
                if (characterAfter === ">") {
                    outputStr += "[";
                    i += 2;
                    continue;
                }

            /*
                If we got this far then this must be a normal opening element.
                Send that to be processed and skip to the end of the tag.
            */
                outputStr += processElement(content.substr(i, content.substr(i).indexOf(">") + 1), name);
                i += content.substr(i).indexOf(">") + 1;
                continue;
            }

        /*
            If we got to here then we must be between tags or at the start or end.
            Any characters here should be processed as text nodes.
        */

            if (!textNode) {
                textNode = true;
                outputStr += '["';
            }


            outputStr += (textNode && (character === "\n" || character === "\t" || character === "\r") ? "" : character);
            i++;

        /* If we get to the end and are inside a text node, close it here. */
            if (i === contentLength && textNode) {
                outputStr += '"]';
            }
        }
    }

    outputStr = outputStr.replace(/\["\s*"],?/g, "");

    // console.log("JSX out: ", outputStr);
    // console.log("===");

    return outputStr;
}
