import { pathsToModuleNameMapper } from 'ts-jest';

export default {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  moduleNameMapper: pathsToModuleNameMapper(
    {
      '@worklog/*': ['src/*'],
    },
    {
      prefix: '<rootDir>/',
    },
  ),
  testEnvironment: 'node',
  moduleDirectories: ['node_modules', '<rootDir>'],
  testRegex: '.*\\.spec\\.ts$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  maxWorkers: 1,
};
