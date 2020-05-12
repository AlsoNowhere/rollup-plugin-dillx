
export const clearComments = content => {
    let output = "";
    content = content
        .split("\n")
        .map(x=>{
            const index = x.indexOf("//");
            return x.substring(0,index===-1?x.length:index);
        })
        .join("\n");

    const l = content.length;
    let insideComment = false;

    for (let i = 0 ; i < l ; i++) {
        const x = content.charAt(i);
        if (content.substr(i,2) === "/*" || content.substr(i,3) === "{/*") {
            insideComment = true;
        }
        if (insideComment && (content.substr(i,2) === "*/" || content.substr(i,3) === "*/}")) {
            insideComment = false;
            i++;
            continue;
        }
        if (!insideComment) {
            output += x;
        }
    }

    // output = output.replace(/{}/g,"");

    return output;
}
