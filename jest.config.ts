import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
  transform: {
    '^.+\\.ts?$': '@swc/jest',
  },
  extensionsToTreatAsEsm: [".ts"],
}

export default jestConfig