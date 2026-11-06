import js from "@eslint/js";
import tseslint from "typescript-eslint";
export default [
  {
    ignores: [
      "src/scenes/kit/**",
      "assets/generated/**",
      "dist/**",
      "node_modules/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.mjs", "**/*.js", "**/*.tsx"],
    languageOptions: {
      globals: {
        document: "readonly",
        window: "readonly",
        HTMLElement: "readonly",
        IntersectionObserver: "readonly",
        console: "readonly",
        URL: "readonly",
        fetch: "readonly",
        process: "readonly",
        setTimeout: "readonly",
        performance: "readonly",
        AbortSignal: "readonly",
      },
    },
  },
];
