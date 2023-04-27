/* eslint-env node */
import { build } from "esbuild";
import babel from "esbuild-plugin-babel";
import process from "process";

const args = process.argv.slice(2);

const watch = args.some((a) => a === "--watch" || a === "-w");

build({
    entryPoints: { mannyLoop: "src/index.ts", hccsAscend: "src/hccsAscend.ts" },
    bundle: true,
    minifySyntax: true,
    platform: "node",
    target: "rhino1.7.14",
    external: ["kolmafia"],
    plugins: [babel()],
    outdir: "KoLmafia/scripts/manny-hccs",
    watch,
    loader: { ".json": "text" },
    inject: ["./kolmafia-polyfill.js"],
    define: {
        "process.env.NODE_ENV": '"production"',
    },
});
