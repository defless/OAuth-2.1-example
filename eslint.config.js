import pooolint from '@poool/eslint-config';

export default [
  { ignores: ['dist/', 'node_modules/'] },
  ...pooolint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ['eslint.config.js'],
        },
        tsconfigDirName: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      'no-console': 'off',
      camelcase: 'off',
      'new-cap': 'off',
    },
  },
];
