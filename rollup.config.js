
import resolve from "@rollup/plugin-node-resolve";

export default {
    input: "./src/main.js",
    output: {
        file: "./dist/rollup-plugin-dillx.js",
        format: "cjs"
    },
    plugins: [
        resolve()
    ]
}
