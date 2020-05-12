
// import { clearComments } from "./support/clear-comments";
// import { resolveContent } from "./support/resolve-content";
// import { resolveComponents } from "./support/resolve-components";
// import { resolveLingeringDillXReferences } from "./support/resolve-lingering-dillx-references";

import { clearComments } from "./services/clear-comments.service";
import { resolveJSX } from "./services/resolve-jsx.service";
import { resolveComponents } from "./services/resolve-components.service";

export const dillx = () => {
    return {
        name: "rollup-plugin-dillx",
        transform(content,name){

            /* -- Do not parse  */
            if (name.split("\\").pop() === "dillx.js") {
                return content;
            }

/* -- Clear comments --
    Any comments left in will still be treated as real code unless they
    are removed.
*/
            content = clearComments(content);
            // console.log("\nFRANCOPHILE 1: ", content);

/* -- Parse the JSX --
    All instances of parenthesis are scanned through and parsed if they are JSX.
*/
            content = resolveJSX(content);
            // console.log("\nFRANCOPHILE 2: ", content);

/* -- Change the syntax --
    Components written with a return statement won't work and so this function
    goes through the code, finds any Components and takes the return statement
    out.
    The Component constructor function is then turned into something dill
    can handle.
*/
            content = resolveComponents(content);
            // console.log("\nFRANCOPHILE 3: ", content);

/* -- Clean up --
    Components need to import dillx (npm -> import dillx from "diilx";)
    and use it to wrap the JSX in, not because this is required for a parsing,
    but because simply writing a contextless dillx variable will make rollup
    treat it as separate to anywhere that dillx is actually imported.

    Case in point, rollup converts the default export that is 'dillx' to 'main',
    'dillx' will be undefined if it is not imported. If dillx is imported and then
    not used VSCode will grey it out.
    dillx() is not actually used and is not a Function and so it should be removed.
*/
            // content = resolveLingeringDillXReferences(content);

            // console.log("\nFRANCOPHILE: ", content);

            return content;
        }
    };
}
