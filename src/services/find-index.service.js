
export const findIndexes = (content,findStr) => {
    const arr = [];
    const l = content.length;
    for (let i = 0 ; i < l ; i++) {
        if (content.substr(i,findStr.length) === findStr) {
            arr.push(i);
        }
    }
    return arr;
}
