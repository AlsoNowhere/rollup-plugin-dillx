import { resolveJSX } from "./resolve-jsx";
import { findDillx } from "./find-dillx";

// let limiter = 0;
// const damLimitSize = 1000;

// const recursiveResolveContent = content => {

// // Catch and prevent infinite loops in the build step.
//     if (++limiter > damLimitSize) {
//         console.log("Infinite loop detected. Errored out.");
//         throw new Error("Dam breached");
//     }

//     let output = content.replace(/([^()]*)/g,
//         x=>"[!1]"+resolveJSX(x.substring(1,x.length-1))+"[!2]"
//     );

//     if (output !== content) {
//         output = recursiveResolveContent(output);
//     }

//     return output;
// }

/* -- Anything inside parenthesis is checked for JSX content. --
    Parenthesis are escaped with a temporary character to
    prevent infinite loops until all the code is checked
    then they are reinserted.
*/
export const resolveContent = content => {

    let output2 = '';
    content = content.replace(/=>/g,"[!11]");

    const dillxInstances = findDillx(content);

    // console.log("Instances: ", dillxInstances);

    if (dillxInstances.length === 0) {
        return content.replace(/\[!11\]/g,"=>");
    }

    output2 += content.substring(0,dillxInstances[0].start);
    dillxInstances.forEach((x,i)=>{
        output2 += `dillx(${resolveJSX(x.content)})`;
        if (i < dillxInstances.length-1) {
            output2 += content.substring(x.end,dillxInstances[i+1].start);
        }
    });
    output2 += content.substr(dillxInstances.pop().end);

    output2 = output2.replace(/\[!11\]/g,"=>")

    // console.log("Ouptu: ", output2);

    return output2;
}
