module.exports = {
  env: {
    es6: true,
    browser: true,
    jasmine: true
  },
  plugins: ['react'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    }
  },
  extends: ['airbnb', 'plugin:react/recommended'],
  rules: {
    'arrow-body-style': 0,
    'arrow-parens': 0,
    'class-methods-use-this': 0,
    'comma-dangle': 0,
    'implicit-arrow-linebreak': 0,
    'import/no-extraneous-dependencies': [
      2,
      {
        devDependencies: ['.storybook/**', 'src/stories/**']
      }
    ],
    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/label-has-for': 0,
    'function-paren-newline': 0,
    'no-alert': 0,
    'no-console': 0,
    'no-underscore-dangle': 0,
    'object-curly-newline': 0,
    'operator-linebreak': 0,
    'linebreak-style': 0,
    'no-bitwise': 0,
    'no-mixed-operators': 0,
    'react/button-has-type': 0,
    'react/display-name': 2,
    'react/forbid-prop-types': 0,
    'react/jsx-closing-bracket-location': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/no-array-index-key': 0,
    'react/prefer-stateless-function': 0,
    'react/prop-types': 2,
    'react/require-default-props': 0,
    'react/jsx-filename-extension': 0,
    'react/jsx-wrap-multilines': 0,
    indent: 0,
    semi: 0
  }
}
