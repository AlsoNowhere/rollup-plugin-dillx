
export const clearComments = content => content
    .split("\n")
    .map(x=>{
        const index = x.indexOf("//");
        return x.substring(0,index===-1?x.length:index);
    })
    .join("\n");
