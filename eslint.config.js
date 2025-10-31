import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'
import stylistic from '@stylistic/eslint-plugin'

export default tseslint.config(
  eslint.configs.recommended,

  ...tseslint.configs.recommended,

  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    noTabs: true,
  }),
  {
    plugins: {
      '@stylistic': stylistic,
    },
    rules: {
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/member-delimiter-style': 'off',
    },
  },
)
