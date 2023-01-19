module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['plugin:vue/vue3-essential', 'sonarjs'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    sourceType: 'module',
  },
  globals: {
    defineProps: true,
    TA: true,
    API: true,
    ClientMonitor: true,
    Acme: true,
  },
  plugins: ['vue'],
  rules: {
    'no-console': 1,
    'no-magic-numbers': 0,
  },
};
