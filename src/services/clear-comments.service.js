
import { findInsideContent } from "./find-inside-content.service";

export const clearComments = content => {

    content = content.replace(/"[a-zA-Z0-9/:.]+"/g,x=>x.replace(/\/\//g,"{!11!}"));

    content = content.split("\n").filter(x=>{
        return x.substr(0,2) !== "//";
    }).map(x=>{
        return x.split("//")[0];
    }).join("\n");

    content = findInsideContent(content,"{/*","{/*","*/}",()=>{
        return "";
    });

    content = findInsideContent(content,"/*","/*","*/",()=>{
        return "";
    });

    content = content.replace(/{!11!}/g,"//");

    return content;
}
