require('util').inspect.defaultOptions.depth = null;
module.exports = {
  preset: "jest-puppeteer",
  setupFilesAfterEnv: ['./jest.setup.js'],
}