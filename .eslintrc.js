module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    'airbnb-typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ["./tsconfig.json"]

  },
  rules: {
    "import/extensions": "off",
    "react/jsx-filename-extension": "off",
    "import/no-extraneous-dependencies": "off"
  }
};
