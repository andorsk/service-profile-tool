/** @type {import('jest').Config} */
const config = {
  moduleFileExtensions: ["js", "jsx", "ts", "tsx"],
  rootDir: "src",
  preset: "ts-jest",
  extensionsToTreatAsEsm: [".ts"],
  testRegex: ".*\\.spec\\.ts$",
  transform: {
    "^.+\\.(t|j)s$": "ts-jest",
  },
  testEnvironment: "node",
  transformIgnorePatterns: ["/node_modules/(?!@noble)"],
};

module.exports = config;
