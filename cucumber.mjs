export default {
  paths: ['tests/scenarios/**/*.feature'],
  import: ['tests/runner/**/*.ts'],
  format: ['progress'],
  formatOptions: { snippetInterface: 'async-await' }
};
