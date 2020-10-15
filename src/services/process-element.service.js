
import { processAttributes } from "./process-attributes.service";

export const processElement = (content, name) => {

    if (content.charAt(1) === "/") {
        return`),`;
    }

    const firstSpace = content.indexOf(" ");
    const title = content.substring(1, firstSpace !== -1 ? firstSpace :content.indexOf(">"));
    const isComponent = title.charAt(0) !== title.charAt(0).toLowerCase();
    const attributes = firstSpace !== -1 ? content.substring(firstSpace + 1, content.indexOf(">")) : null;
    const isSelfClosing = content.charAt(content.length - 2) === "/";
    const ending = isSelfClosing ? '),' : ', ';
    let elementAttributes = processAttributes(attributes, name);
    // console.log("Elke: ", elementAttributes);
    // console.log("Elke: ", elementAttributes.replace(/,/g, ",\n"));
    // elementAttributes !== null && (elementAttributes = elementAttributes.replace(/,/g, "\n,"));

    return `\ndill.element(${!isComponent ? '"' : ''}${title}${!isComponent ? '"' : ''}, ${elementAttributes.replace(/,/g, ",\n")}${ending}`;
}
