export default {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.js', '**/?(*.)+(spec|test).js'],
  testPathIgnorePatterns: ['/node_modules/', 'setup-env.js'],
  transform: {},
  testTimeout: 10000,
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup-env.js']
};
