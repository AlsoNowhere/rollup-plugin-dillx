
import { get } from "sage-library";

export const generateStrings = () => new function(){
    this.single = false;
    this.double = false;
    this.special = false;
    get(this, "inAString", () => this.single || this.double || this.special);
    Object.seal(this);
}
