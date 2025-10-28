// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

export default [...nextCoreWebVitals, {
  ignores: ['node_modules/**', '.next/**'],
}, ...storybook.configs["flat/recommended"]];

