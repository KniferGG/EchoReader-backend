import sharedConfig from './jest.config';
import { Config } from '@jest/types';

const unitConfig: Config.InitialOptions = {
  ...sharedConfig,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'cobertura'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!*/node_modules/**',
    '!<rootDir>/src/main.ts',
    '!<rootDir>/src/modules/database/database.service.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 10,
      functions: 10,
      lines: 10,
      statements: 10,
    },
  },
};

export default unitConfig;
