
import { resolveMethods } from "./resolve-methods";

export const buildAttributes = (str,methods) => {

    const l = str.length;

    let insideSpeech = false;
    let insideBraces = null;
    let insideBraceNumber = null;
    let braces = 0;
    let newStr = "";

    for (let i = 0 ; i < l ; i++) {
        const x = str.substr(i,1);
        if (x === '"') {
            insideSpeech = !insideSpeech;
            if (insideBraces === null) {
                newStr += x;
            }
            continue;
        }
        if (insideSpeech) {
            if (insideBraces === null) {
                newStr += x;
            }
            continue;
        }
        if (x === "{") {
            braces++;
        }
        if (x === "}") {
            braces--;
        }
        if (x === "{" && insideBraces === null) {
            insideBraces = i;
            insideBraceNumber = braces;
            continue;
        }
        if (x === "}" && insideBraces !== null && braces === insideBraceNumber - 1) {

            let contentInside = str.substring(insideBraces,i+1);

            if (contentInside.substr(0,4) === "{...") {
                contentInside = "{" + contentInside.substr(4);
                newStr += "dill-extends=";
            }

            let _value = contentInside
                .replace(/"/g,"'");
            _value = _value.substring(1,_value.length-1);
            const {templateName,value} = resolveMethods(_value,methods);

            methods[templateName] = value;
            insideBraces = null;
            insideBraceNumber = null;
            newStr += `"${templateName}"`;
            continue;
        }
        if (insideBraces !== null) {
            continue;
        }
        newStr += x;
    }

// /* Anything inside a tag that matches the attribute format is added to the attribute list. */
    let _attributes = [];
    newStr
        .replace(/\s[a-z-]+="[^"]+"/g,x=>_attributes.push(x))
        .replace(/\s[$a-z-]+/g,x=>_attributes.push(x));

    _attributes = _attributes.map(x=>{
        const split = x.substr(1).split("=");
        let name = split[0];
        if (name.substr(0,1) === "$") {
            name = name.substr(1) + "---";
        }
        const attribute = {
            name: `"${ name}"`
        };
        if (split[1]) {
            attribute.value = split[1];
        }
        return attribute;
    });

// /* Build the attribute literal string. */
    const attributes = _attributes.map(x=>`{name:${x.name}${x.value?`,value:${x.value}`:""}}`).join(",");

/* Space for debugging */

    return attributes;
}
