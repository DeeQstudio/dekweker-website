import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import postcss from "postcss";

export function readStyles(root = process.cwd()) {
  const manifest = resolve(root, "src/app/globals.css");
  const imports = postcss.parse(readFileSync(manifest, "utf8"), { from: manifest });
  const files = [];
  imports.walkAtRules("import", (rule) => {
    const file = resolve(dirname(manifest), rule.params.replaceAll('"', ""));
    files.push({ file, css: readFileSync(file, "utf8") });
  });
  return files;
}
