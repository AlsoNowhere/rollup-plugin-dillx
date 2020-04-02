
export const resolveLingeringDillXReferences = content => {

    // console.log("Linger: ", content);

    let output = '';
    let parenthesis = 0;
    let startParenthesis = null;
    const l = content.length;
    for (let i = 0 ; i < l ; i++) {
        const x = content.substr(i,1);
        if (content.substr(i,6) === "dillx[") {
            i += 6;
            output += "[";
            continue;
        }
        if (content.substr(i,6) === "dillx(") {
            i += 6;
            output += "[";
            startParenthesis = parenthesis;
            parenthesis++;
            continue;
        }
        if (x === "(") {
            parenthesis++;
        }
        if (x === ")") {
            parenthesis--;
        }
        if (startParenthesis !== null && parenthesis === startParenthesis && x === ")") {
            startParenthesis = null;
            output += "]";
            continue;
        }
        output += x;
    }
    return output;
}
