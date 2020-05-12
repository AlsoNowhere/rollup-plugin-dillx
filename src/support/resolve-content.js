
import { resolveJSX } from "./resolve-jsx";
import { findDillx } from "./find-dillx";

/* -- Anything inside parenthesis is checked for JSX content. --
    Parenthesis are escaped with a temporary character to
    prevent infinite loops until all the code is checked
    then they are reinserted.
*/
export const resolveContent = content => {

    let output2 = '';
    content = content.replace(/=>/g,"[!11]");

    const dillxInstances = findDillx(content);

    if (dillxInstances.length === 0) {
        return content.replace(/\[!11\]/g,"=>");
    }

    output2 += content.substring(0,dillxInstances[0].start);
    dillxInstances.forEach((x,i)=>{
        output2 += `${x.isIsolate?"dillx.isolate(":"dillx("}${resolveJSX(x.content)})`;
        if (i < dillxInstances.length-1) {
            output2 += content.substring(x.end,dillxInstances[i+1].start);
        }
    });
    output2 += content.substr(dillxInstances.pop().end);

    output2 = output2.replace(/\[!11\]/g,"=>")

    return output2;
}
