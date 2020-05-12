
import { findInsideContent } from "./find-inside-content.service";

export const resolveJSX = content => {
    content = findInsideContent(content,"dillx(","(",")",jsx=>{
        const extraProperties = {};
        const attributeValues = {};
        let extraPropertyIndex = -1;
        jsx = jsx.replace(/[\r\n]+/g,"");
        jsx = jsx.replace(/=>/g,"[!11!]");
        jsx = jsx.substring(jsx.indexOf("<"),jsx.lastIndexOf(">")+1);
        jsx = findInsideContent(jsx,">",">","<",betweenAngleBrackets=>`>"${betweenAngleBrackets.substring(1,betweenAngleBrackets.length-1)}",<`);
        jsx = jsx.replace(/<>/g,"dillx.template([")
            .replace(/<\/>/g,"])");
        jsx = findInsideContent(jsx,"<","<",">",angleContent=>{
            if (angleContent.charAt(1) === "/") {
                return "]),";
            }
            angleContent = angleContent.replace(/"[!a-zA-Z0-9\s-_$:;{}.'#/]+"/g,a=>a.replace(/{/g,"[!12!]").replace(/}/g,"[!13!]"));
            angleContent = findInsideContent(angleContent,"{","{","}",a=>{
                extraPropertyIndex++;
                extraProperties[`$template_${extraPropertyIndex}`] = a.substring(1,a.length-1);
                return `"$template_${extraPropertyIndex}"`;
            });
            angleContent = angleContent.replace(/\[!12!\]/g,"{").replace(/\[!13!\]/g,"}");
            {
                let i = -1;
                angleContent = angleContent.replace(/"[!a-zA-Z0-9\s-_$:;{}.'#/]*"/g,a=>{
                    i++;
                    attributeValues[`attr${i}`] = a;
                    return `"attr${i}"`;
                });
            }
            const selfClosing = angleContent.substr(angleContent.length-2) === "/>";
            angleContent = angleContent.substring(1,angleContent.length-(selfClosing?2:1));
            const angleContentSplits = angleContent.split(" ");
            const tag = angleContentSplits[0];
            const firstChar = tag.charAt(0);
            const name = firstChar.toLowerCase() !== firstChar ? tag : `"${tag}"`;
            const attributes = angleContentSplits.slice(1).filter(a=>a!=="").map(a=>{
                const split = a.split("=");
                const value = split[1] && split[1].match(/attr[0-9]+/) && attributeValues[split[1].substring(1,split[1].length-1)].replace(/"/g,"");
                return {name:split[0],value};
            });
            let output = `dillx.template(/*${JSON.stringify(extraProperties)}*/${name},${JSON.stringify(attributes)}`;
            Object.keys(extraProperties).forEach(x=>delete extraProperties[x]);
            return output + (selfClosing ? ")," : ",[");
        });
        if (jsx.charAt(jsx.length-1) === ",") {
            jsx = jsx.substring(0,jsx.length-1);
        }
        jsx = jsx.replace(/,]/g,"]");
        jsx = jsx.replace(/\[!11!\]/g,"=>");
        return jsx;
    });
    return content;
}
