
export const findInsideContent = (str,start,ignore,end,resolver) => {
    let index = 0;
    let output = "";
    let currentIndex = null;
    let currentPiece = "";
    let startIndex = null;
    let currentMatch = 0;
    const l = str.length;
    for (let i = 0 ; i < l ; i++) {
        const x = str[i];
        if (currentIndex !== null && str.substr(i,end.length) === end) {
            if (--index === currentIndex) {
                output += resolver(currentPiece + end, currentMatch, startIndex);
                currentMatch++;
                currentIndex = null;
                i += end.length-1;
                currentPiece = "";
                continue;
            }
        }
        if (currentIndex !== null && str.substr(i,ignore.length) === ignore) {
            index++;
            currentPiece += x;
            continue;
        }
        if (currentIndex === null && str.substr(i,start.length) === start) {
            currentIndex = index;
            index++;
            output += currentPiece;
            currentPiece = start;
            startIndex = i;
            i += start.length-1;
            continue;
        }
        currentPiece += x;
    }

    return output + currentPiece;
}
