
import { buildAttributes } from "./build-attributes";
import { resolveTextContent } from "./resolve-text-content";

/* Must conform to a '< then >' pattern. */
const recurseArrowCheck = str => {
    if (str.indexOf("<") === -1) {
        return true;
    }
    if (str.indexOf("<") > str.indexOf(">")) {
        return false;
    }
    return recurseArrowCheck(str.substring(str.indexOf(">")+1));
}

export const resolveJSX = str => {

/* If the content does not contain any angle brackets then there is nothing to parse so return the whole thing. */
    if (str.indexOf("<") === -1) {
        return str;
    }

    const methods = {
        _index: 0
    };

    let output = `"` + str

/* Remove line breaks and carriage returns. (Where we're going, we don't need 'em!) */
        .replace(/[\r\n]+/g,"")

/* Escape arrow functions syntax so they doesn't cause issues when parsing. */
        .replace(/=>/g,"[!11]")

        .replace(/>[^>]*</g,x=>resolveTextContent(x,methods))

/* Find all instances of tags (anything between < and >: */
        .replace(/<[^<]*>/g,x=>{

    /* Handle fragments and closing tags. */
            if (x === "<>") {
                return `",["`;
            }
            if (x === "</>") {
                return `"],"`;
            }
            if (x.substr(0,2) === "</") {
                return `"]),"`;
            }

    /* Find the tag name by splitting for spaces and using the first item in the resulting Array. */
    /* If the first letter is capital then assume this is a Component. */
            let tagName = x.substring(1,x.length-1).split(" ")[0];
            tagName = tagName.charAt(0).toLowerCase() !== tagName.charAt(0) ? tagName : `"${tagName}"`;

            const attributes = buildAttributes(x,methods);

    /* Create the end of the string literal. Check if the tag is self closing. */
            const end = x.charAt(x.length-2) === "/" ? `),"` : `,["`;
            let output = `",dillx.template(${tagName},[${attributes}]${end}`;

    /* Room for console logging debugging. */

            return output;
        }) + `"`;

/* A lot of pointless strings can be added into the Arrays here. These two replacers try to clean things up a bit. */
    output = output.replace(/"\s*",/g,"")
        .replace(/,"\s*"/g,"")
        .replace(/"\s+"/g,"");

    delete methods._index;

    return "\n//#goose" + JSON.stringify(methods) + "\n" + output;
}
