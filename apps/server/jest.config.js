
const { defaults: tsjPreset } = require('ts-jest/presets');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
preset: '@shelf/jest-mongodb',
transform: tsjPreset.transform,
coverageDirectory: './coverage',
collectCoverageFrom: [
    './src/**/*.ts',
],
collectCoverage: true,
}