import { defineConfig, globalIgnores } from "eslint/config"

import { FlatCompat } from "@eslint/eslintrc"
import { fileURLToPath } from "node:url"
import globals from "globals"
import js from "@eslint/js"
import path from "node:path"
import tsParser from "@typescript-eslint/parser"
import typescriptEslint from "@typescript-eslint/eslint-plugin"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

export default defineConfig([
  globalIgnores(["./.github", "./dist"]),
  {
    extends: compat.extends("eslint:recommended", "prettier"),

    plugins: {
      "@typescript-eslint": typescriptEslint,
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.commonjs,
        ...globals.node,
        Buffer: "readonly",
        BufferEncoding: "readonly",
      },

      parser: tsParser,
      ecmaVersion: 12,
      sourceType: "commonjs",
    },

    rules: {
      indent: [
        "error",
        2,
        {
          SwitchCase: 1,
        },
      ],

      "no-unused-vars": "off",
      "no-redeclare": "off",
      quotes: ["error", "double"],
      semi: ["error", "never"],
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],

    rules: {
      "no-dupe-class-members": "off",
    },
  },
])
