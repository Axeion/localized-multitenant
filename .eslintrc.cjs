module.exports = {
  // Replace any reference to '@payloadcms' with standard configs
  extends: [
    'next/core-web-vitals',
    // Remove or replace '@payloadcms' with a standard config
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  // Add your other ESLint settings...
  rules: {
    // You can add custom rules here
    'react/react-in-jsx-scope': 'off', // Not needed for Next.js
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};