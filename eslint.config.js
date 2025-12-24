import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import stylistic from '@stylistic/eslint-plugin';

export default [
  // On étale les configs recommandées (TS + Angular)
  ...tseslint.configs.recommended,
  ...angular.configs.tsRecommended,

  {
    files: ["**/*.ts"],
    plugins: {
      '@stylistic': stylistic
    },
    processor: angular.processInlineTemplates, // Important pour AnalogJS (template dans le TS)
    rules: {
      // Indentation : 2 espaces
      '@stylistic/indent': ['error', 2],

      // Quotes : Simple quotes
      '@stylistic/quotes': ['error', 'single', {'avoidEscape': true}],

      // Espaces dans les accolades : { maVar }
      '@stylistic/object-curly-spacing': ['error', 'always'],

      // Point-virgules
      '@stylistic/semi': ['error', 'always'],

      "max-len": [
        "error",
        {
          "code": 120,
          "ignoreUrls": true,
          "ignoreStrings": true,
          "ignoreTemplateLiterals": true,
          "ignoreRegExpLiterals": true
        }
      ],

      // --- 5. Angular : Préfixes multiples (app + trapotopia) ---
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: ["app", "trapotopia"],
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: ["app", "trapotopia"],
          style: "kebab-case",
        },
      ],
    },
  },
];
