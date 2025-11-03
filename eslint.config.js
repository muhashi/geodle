import { defineConfig } from "eslint/config";

import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import js from "@eslint/js";

import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
    baseDirectory: import.meta.dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    languageOptions: {
        globals: {
            ...globals.browser,
        },

        parser: tsParser,
        ecmaVersion: "latest",
        sourceType: "module",

        parserOptions: {
            ecmaFeatures: {
                jsx: true,
            },
        },
    },

    extends: compat.extends(
        "plugin:react/recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
    ),

    plugins: {
        react,
        "@typescript-eslint": typescriptEslint,
    },

    rules: {
        "react/react-in-jsx-scope": "off",

        "react/jsx-filename-extension": [2, {
            extensions: [".js", ".jsx", ".ts", ".tsx"],
        }],

        "react/require-default-props": "off",
    },
}]);
