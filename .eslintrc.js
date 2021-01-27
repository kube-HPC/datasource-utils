module.exports = {
    env: {},
    extends: ['airbnb/base', 'plugin:prettier/recommended'],
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    plugins: ['prettier', 'jsdoc'],
    rules: {
        'import/no-extraneous-dependencies': [0],
        'no-console': [1, { allow: ['info', 'warn', 'error'] }],
        'import/no-useless-path-segments': [0],
        'no-nested-ternary': [0],
        'import/no-named-as-default-member': [0],
        'import/no-named-as-default': [0],
        'no-underscore-dangle': [0],
    },
};
