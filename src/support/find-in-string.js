
export const findInString = (content,startChar,endChar,openingSequence=startChar) => {

    const l = content.length;
    const instances = [];

    let start = null;
    let startItem = null;
    let items = 0;

    for (let i = 0 ; i < l ; i++) {
        const x = content.substr(i,1);
        if (start === null && content.substr(i,openingSequence.length) === openingSequence) {
            start = i;
            startItem = items;
        }
        if (x === startChar) {
            items++;
        }
        if (x === endChar) {
            items--;
        }
        if (start !== null && items === startItem && x === endChar) {
            instances.push({
                start,
                end: i+1,
                content: content.substring(start+openingSequence.length,i)
            });
            start = null;
            startItem = null;
        }
    }
    return instances;



}
