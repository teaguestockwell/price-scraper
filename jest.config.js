require('util').inspect.defaultOptions.depth = null;
module.exports = {
  preset: 'jest-playwright-preset',
  setupFilesAfterEnv: ['./jest.setup.js'],
};
