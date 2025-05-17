module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    // Disable rules causing problems
    'no-unused-vars': 'off',
    'react/display-name': 'off',
    '@next/next/no-html-link-for-pages': 'off',
    'import/no-anonymous-default-export': 'off',
  },
};