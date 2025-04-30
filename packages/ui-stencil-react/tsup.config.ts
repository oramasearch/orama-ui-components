import { defineConfig, type Options } from "tsup";

export default defineConfig((options): Options => {
  return {
    entry: ["src/index.ts", "src/orama-ui.css"],
    format: ["cjs", "esm"],
    target: "es2017",
    dts: true,
    sourcemap: true,
    splitting: true,
    clean: true,
    minify: !options.watch,
    outDir: "dist",
    external: ["react", "react-dom"],
    injectStyle: true,
    noExternal: ["@orama/wc-components"],
    outExtension({ format }) {
      return {
        js: format === "esm" ? ".mjs" : ".cjs",
      };
    },
  };
});
