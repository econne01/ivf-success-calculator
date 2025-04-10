"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** @type {import('ts-jest').JestConfigWithTsJest} **/
exports.default = {
    preset: 'ts-jest',
    testEnvironment: "node",
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    setupFilesAfterEnv: [
        '<rootDir>/jest.setup.ts'
    ],
};
