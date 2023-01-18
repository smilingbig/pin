module.exports = {
  verbose: true,
  transform: {
    "^.+\\.tsx?$": "esbuild-jest",
  },
  testEnvironment: "node",
  collectCoverage: true,
  coverageDirectory: "coverage",
  testPathIgnorePatterns: ["/node_modules/"],
};
