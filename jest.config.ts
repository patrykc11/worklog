import { pathsToModuleNameMapper } from 'ts-jest';

export default {
  // Pliki testów
  // testMatch: ['<rootDir>/test/**/*.spec.ts'],

  // Używanie transformacji przez ts-jest
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },

  // Mapowanie aliasów z tsconfig.json
  moduleNameMapper: pathsToModuleNameMapper(
    {
      '@worklog/*': ['src/*'],
    },
    {
      prefix: '<rootDir>/',
    },
  ),

  // Środowisko testowe
  testEnvironment: 'node',

  // Główne katalogi, w których Jest szuka modułów
  moduleDirectories: ['node_modules', '<rootDir>'],
  testRegex: '.*\\.spec\\.ts$',

  // Rozpoznawane rozszerzenia plików
  moduleFileExtensions: ['ts', 'js', 'json'],
};
