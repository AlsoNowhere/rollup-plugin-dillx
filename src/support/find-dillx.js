
export const findDillx = content => {
    let start = null;
    let startBraces = null;
    let braces = 0;
    let isIsolate = false;
    const l = content.length;
    const instances = [];
    for (let i = 0 ; i < l ; i++) {
        const x = content.substr(i,1);
        if (start === null && (content.substr(i,6) === "dillx(" || content.substr(i,14) === "dillx.isolate(")) {
            start = i;
            startBraces = braces;
            isIsolate = content.substr(i,14) === "dillx.isolate(";
        }
        if (x === "(") {
            braces++;
        }
        if (x === ")") {
            braces--;
        }
        if (start !== null && braces === startBraces && x === ")") {
            instances.push({
                start,
                end: i+1,
                content: content.substring(start+(isIsolate?14:6),i),
                isIsolate
            });
            start = null;
            startBraces = null;
            isIsolate = false;
        }
    }
    return instances;
}
