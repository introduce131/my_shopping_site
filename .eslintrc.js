module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:react/recommended'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'no-unused-vars': 1, // 사용하지않는 변수 error처리 하겠다.
    'no-console': 'off', // 콘솔로그를 사용하수 있게 꺼놓겠다.
    'no-else-return': 'warn',
    semi: [1, 'always'],
    'space-unary-ops': 2,
    'react/no-unescaped-entities': 0,
  },
};
