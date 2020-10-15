
import { processComments } from "./services/process-comments.service";
import { processFile } from "./services/process-file.service";
import { processComponents } from "./services/process-components.service";

export const dillx = () => {
    return {
        name: "rollup-plugin-dill",
        transform(content, name){

/* -- Do not parse this file  */
            if (name.split("\\").pop() === "dill.js") {
                return content;
            }

            const fileName = name.split("\\").pop();

            content = processComments(content, fileName);

            content = processFile(content, fileName);

            content = processComponents(content, fileName);

            return content;
        }
    };
}
