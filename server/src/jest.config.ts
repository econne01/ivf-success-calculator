/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
    preset: 'ts-jest',
    testEnvironment: "node",
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    setupFilesAfterEnv: [
      '<rootDir>/src/jest.setup.ts'
    ],
  };
  