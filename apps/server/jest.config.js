/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
};

// use the transform format below to get access mongodb and typescript


// const { defaults: tsjPreset } = require('ts-jest/presets');
// module.exports = {
// preset: '@shelf/jest-mongodb',
// transform: tsjPreset.transform,
// coverageDirectory: './coverage',
// testMatch: [
// ***/?(*.)+(spec).ts'
// ],
// collectCoverageFrom: [
// 'src/**/*.ts'
// collectCoverage: true,
// resetMocks: true,
// clearMocks: true,
// watchPathIgnorePatterns: ['globalConfig']
// }