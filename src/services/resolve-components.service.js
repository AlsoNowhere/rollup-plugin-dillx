
import { findIndexes } from "./find-index.service";
import { findInsideContent } from "./find-inside-content.service";

const parseName = str => {
    let output = "";
    const lower = str.toLowerCase();
    str.split("").forEach((x,i)=>{
        if (x !== lower[i] && i !== 0) {
            output += "-";
        }
        output += lower[i];
    });
    return output;
}

export const resolveComponents = content => {

    // let output = "";

    // const indexes = findIndexes(content,"const ").filter(x=>content.charAt(x+6).toLowerCase()!==content.charAt(x+6));

    // if (indexes.length === 0) {
    //     return content;
    // }

    // output += content.substring(0,indexes[0]);

    // indexes.forEach(x=>{
    //     const str = content.substr(x);

    //     let tag = str.substr(str.indexOf("const ")+6);
    //     tag = tag.substring(0,tag.indexOf(" "));

    //     output += findInsideContent(str,"{","{","}",functionContent=>{
    //         const returnIndex = functionContent.indexOf("return dillx.template(");
    //         if (returnIndex === -1) {
    //             return functionContent;
    //         }
    //         const lineBreak = returnIndex+functionContent.substr(returnIndex).indexOf("\n");
    //         let template = functionContent.substring(returnIndex,lineBreak).replace("return","");
    //         let extraProperties = "";
    //         template = findInsideContent(template,"/*","/*","*/",x=>{
    //             const json = JSON.parse(x.substring(2,x.length-2));
    //             Object.entries(json).forEach(y=>{
    //                 extraProperties += `this.${y[0]} = function(){return ${y[1]}};\n`;
    //             });
    //             return "";
    //         });

    //         if (template.charAt(template.length-1) === ";") {
    //             template = template.substring(0,template.length-1);
    //         }

    //         return functionContent.substring(0,returnIndex)
    //             + extraProperties
    //             + "\n}\n"
    //             + `${tag}.component = new dillx.Component("${parseName(tag)}",${template});`;
    //     });
    // });

    // console.log("\nOutput: ", output);









    // let output = "";
    // let currentComponentName;
    // let remainingContent;
    // let functionContent;
    // const components = [];
    let output = content;

    // content.replace(/const\s*[a-zA-Z]{1}[a-zA-Z0-9]+\s*=/g,(_,i)=>
    //     console.log("Index: ", i)
    // );

    const regexp = /const\s*[A-Z]{1}[a-zA-Z0-9]+\s*=/g;
    let match;
    while ((match = regexp.exec(content)) != null) {
        // console.log("match found at " + match.index);

        // currentComponentName = match[0].replace("=","").replace("const","").replace(/\s/g,"");
        // remainingContent = content.substr(match.index);
        // let i = 0;
        // findInsideContent(remainingContent,"{","{","}",x=>{
        //     if (i++ !== 0) {
        //         return x;
        //     }
        //     functionContent = x;
        // });


        // console.log("Content: ", currentComponentName, functionContent);

        // components.push({
        //     name:match[0].replace("=","").replace("const","").replace(/\s/g,""),
        //     index:match.index
        // });

        const name = match[0].replace("=","").replace("const","").replace(/\s/g,"");

        output = output.substring(0,match.index) + findInsideContent(output.substr(match.index),"{","{","}",(x,i)=>{

            const index = x.lastIndexOf("return dillx.template(");

            if (i !== 0 || index === -1) {
                return x;
            }





            let extraProperties = {};
            let template = findInsideContent(x.substr(index,x.substr(index).indexOf("\n")).replace("return ",""),"/*","/*","*/",y=>{
                const _extraProperties = JSON.parse(y.substring(2,y.length-2));
                Object.entries(_extraProperties).forEach(z=>{
                    extraProperties[z[0]] = z[1];
                });
                // console.log("Get 2: ", _extraProperties, extraProperties);
                return "";
            });


            if (template.charAt(template.length-1) === ";") {
                template = template.substring(0,template.length-1);
            }

            // console.log("Output: ", Object.entries(extraProperties).map(y=>`this.${y[0]} = function(){return ${y[1]}};\n`));

            return x.substring(0,index)
                + Object.entries(extraProperties).reduce((a,b)=>a+`this.${b[0]} = function(){return ${b[1]}};\n`,"")
                + "\n}\n"
                + `${name}.component = new dillx.Component("${parseName(name)}",${template});`;




        });




    }


    // let i = 0;
    // const output = findInsideContent(content,"{","{","}",(x,i)=>{
    //     const index = x.indexOf("return dillx.template(");
    //     if (index === -1) {
    //         return x;
    //     }
    //     // const component = components.reduce((a,b)=>a!==null?a:b.index<i?b:a,null);
    //     // components.shift();
    //     const component = components[i];

    //     const template = x.substring(index,x.substr(index).indexOf("\n"));

    // //     i++;

    //     return x.substring(0,index)
    //         + template
    //         + "\n}\n"
    //         + `${component.name}.component = new dillx.Component(${parseName(component.name)},${template});`;
    // });




    // console.log("Output: ", output);

    return output;
}
