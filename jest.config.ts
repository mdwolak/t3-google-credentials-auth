import nextJest from "next/jest";

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  preset: "ts-jest",
  verbose: true,
  moduleNameMapper: {
    "^~/(.*)$": "<rootDir>/src/$1",
  },
  setupFilesAfterEnv: ["<rootDir>/__tests__/helpers/prismaMock.ts","<rootDir>/jest.setup.ts"],
  testEnvironment: "jest-environment-jsdom",
  clearMocks: true,
  //globalSetup: '<rootDir>/__tests__/jest.setup.ts',
  testMatch: ["**/?(*.)+(test).[jt]s?(x)"],
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
