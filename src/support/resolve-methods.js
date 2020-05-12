
export const resolveMethods = (str,methods) => {

    const templateName = "template$_" + methods._index++;
    let value;

    if (str.indexOf("{") !== -1) {
        if (
            str.substring(0,str.indexOf("{")).match(/function\s*[^\s]*\(.*\)\s*/)===null
            && str.substring(0,str.indexOf("{")).match(/\(.*\)\s*\[!11\]\s*/)===null
        ) {
            value = `function(){return ${str}}`;
        }
    }
    else {
        if (
            str.match(/function\s*[^\s]*\(.*\)\s*/)===null
            && str.match(/\(.*\)\s*\[!11\]\s*/)===null
        ) {
            value = `function(){return ${str}}`;
        }
    }

    return {templateName,value};
}
