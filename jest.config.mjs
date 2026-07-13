/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', { sourceMaps: 'inline' }],
  },
  moduleNameMapper: {
    '^x-twitter-scraper$': '<rootDir>/src/index.ts',
    '^x-twitter-scraper/(.*)$': '<rootDir>/src/$1',
  },
  modulePathIgnorePatterns: [
    '<rootDir>/ecosystem-tests/',
    '<rootDir>/dist/',
    '<rootDir>/deno/',
    '<rootDir>/deno_tests/',
    '<rootDir>/packages/',
  ],
  testPathIgnorePatterns: ['scripts'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};

export default config;
