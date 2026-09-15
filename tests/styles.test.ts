import { readdirSync, readFileSync } from "node:fs";
import { basename } from "node:path";
import postcss from "postcss";
import { describe, expect, it } from "vitest";
import { readStyles } from "../scripts/styles.mjs";

const styles: { file: string; css: string }[] = readStyles();

describe("stylesheet ownership", () => {
  it("imports every owner exactly once from the root manifest", () => {
    const imported = styles.map(({ file }) => basename(file)).sort();
    expect(imported).toEqual(readdirSync("src/styles").filter((file) => file.endsWith(".css")).sort());
    for (const file of readdirSync("src", { recursive: true, encoding: "utf8" })) {
      if (!file.endsWith(".tsx") || file.replaceAll("\\", "/") === "app/layout.tsx") continue;
      expect(readFileSync(`src/${file}`, "utf8"), file).not.toMatch(/import\s+["'][^"']+\.css["']/);
    }
  });

  it("has one definition per selector and media scope, without specificity hacks", () => {
    const seen = new Map<string, string>();
    for (const { file, css } of styles) {
      postcss.parse(css).walkRules((rule) => {
        const scope: string[] = [];
        let parent = rule.parent;
        while (parent?.type === "atrule") {
          if (parent.name.endsWith("keyframes")) return;
          scope.unshift(`@${parent.name} ${parent.params}`);
          parent = parent.parent;
        }
        for (const selector of rule.selectors) {
          const key = `${scope.join("/")}:${selector}`;
          expect(seen.get(key), `${key} in ${file}`).toBeUndefined();
          seen.set(key, file);
          expect(selector).not.toMatch(/(\.[\w-]+)\1\b/);
        }
        const props = new Set<string>();
        rule.walkDecls((declaration) => {
          expect(props.has(declaration.prop), `${rule.selector}: ${declaration.prop}`).toBe(false);
          props.add(declaration.prop);
          if (declaration.important) {
            expect(scope.join("/")).toContain("prefers-reduced-motion: reduce");
          }
        });
      });
    }
  });
});
