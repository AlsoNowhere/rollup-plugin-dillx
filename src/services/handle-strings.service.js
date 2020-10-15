
export const handleStrings = (character, characterBefore, stringStore) => {
    if (character === "'" && stringStore.single && characterBefore !== "\\") {
        stringStore.single = false;
    }
    else if (character === "'" && !stringStore.single && !stringStore.inAString) {
        stringStore.single = true;
    }

    if (character === '"' && stringStore.double && characterBefore !== "\\") {
        stringStore.double = false;
    }
    else if (character === '"' && !stringStore.double && !stringStore.inAString) {
        stringStore.double = true;
    }

    if (character === "`" && stringStore.special && characterBefore !== "\\") {
        stringStore.special = false;
    }
    else if (character === "`" && !stringStore.special && !stringStore.inAString) {
        stringStore.special = true;
    }
}
