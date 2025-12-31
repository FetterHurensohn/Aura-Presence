/**
 * Jest Konfiguration
 */

export default {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js'
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  transform: {},
  moduleFileExtensions: ['js'],
  verbose: true
};





