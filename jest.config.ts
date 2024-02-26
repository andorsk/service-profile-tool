/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: ["js", "json", "ts"],
  rootDir: "src",
  preset: "ts-jest/presets/default-esm",
  extensionsToTreatAsEsm: [".ts"],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  testEnvironment: "node",
  transformIgnorePatterns: ["/node_modules/(?!@noble)"],
};

module.exports = config;
