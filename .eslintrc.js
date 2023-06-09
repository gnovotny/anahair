const IMPORT_ORDER_CONFIG = {
  groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'object'],
  pathGroups: [
    {
      pattern: 'react',
      group: 'builtin',
      position: 'before',
    },
    {
      pattern: '@/**',
      group: 'internal',
    },
  ],
  pathGroupsExcludedImportTypes: ['react'],
  'newlines-between': 'always',
  alphabetize: {
    order: 'asc',
    caseInsensitive: true,
  },
}

module.exports = {
  extends: ['next', 'prettier', 'plugin:tailwind/recommended'],
  plugins: ['prettier', 'unused-imports'],
  rules: {
    'prettier/prettier': 'warn',
    'import/order': ['warn', IMPORT_ORDER_CONFIG],
    'unused-imports/no-unused-imports': 'warn',
    'react/no-unescaped-entities': ['off'],
    'react/display-name': ['off'],
  },
}
