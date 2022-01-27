module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    indent: ['error', 4],
        semi: ['error', 'always'],
        '@typescript-eslint/no-var-requires': 0,
        // "space-before-function-paren": [
        //     "error",
        //     "never"
        // ],
        // "prefer-const": 0,
        // "vue/no-parsing-error": [
        //     2,
        //     {
        //         "x-invalid-end-tag": false
        //     }
        // ],
        '@typescript-eslint/no-explicit-any': 0,
  }
}
