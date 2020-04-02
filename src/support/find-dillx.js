
export const findDillx = content => {
    let start = null;
    let startBraces = null;
    let braces = 0;
    const l = content.length;
    const instances = [];
    for (let i = 0 ; i < l ; i++) {
        const x = content.substr(i,1);
        if (start === null && content.substr(i,6) === "dillx(") {
            start = i;
            startBraces = braces;
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
                content: content.substring(start+6,i)
            });
            start = null;
            startBraces = null;
        }
    }
    return instances;
}
