import { findInString } from "./find-in-string";
import { resolveMethods } from "./resolve-methods";

export const resolveTextContent = (str,methods) => {

    const instances = findInString(str,"{","}");

    instances.forEach(x=>{
        if (!x.content.match(/[a-zA-Z_$]{1}[a-zA-Z0-9_$]*/g)) {
            const {templateName,value} = resolveMethods(x.content,methods);
            str = str.substring(0,x.start) + "{" + templateName + "}" + str.substr(x.end);
            methods[templateName] = value;
        }
    });

    return str;
}
