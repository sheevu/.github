import js from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: ['node_modules/**', 'dist/**', 'build/**'],
  },
  {
    settings: {
      'import/resolver': {
        typescript: {
          project: './tsconfig.json'
        }
      }
    }
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginImport.flatConfigs.recommended,
  pluginImport.flatConfigs.typescript,
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      'import/no-unresolved': 'error'
    }
  },
  eslintConfigPrettier
);
