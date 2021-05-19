module.exports = {
  "extends": ["react-app"],
  "env": {
    "es6": true,
    "browser": true
  },
  "plugins": [
    "react",
    "react-hooks",
    "import",
  ],
  // "parser": "babel-eslint",
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module",
    "allowImportExportEverywhere": true,
    "ecmaFeatures": {
      "jsx": true,
      "modules": true,
    },
  },
  "settings": {
    "import/resolver": {
      "babel-module": {
        "root": ['.'],
        "extensions": ['.js', '.jsx', '.ts', '.tsx'],
        "alias": {
          "#actions": "./src/root/actions",
          "#components": "./src/root/components",
          "#config": "./src/root/config",
          "#hooks": "./src/root/hooks",
          "#lang": "./src/root/lang",
          "#selectors": "./src/root/selectors",
          "#utils": "./src/root/utils",
          "#views": "./src/root/views",
          "#root": "./src/root",
        }
      },
    },
    "react": {
      "version": "detect"
    }	
  },
  "rules": {
    // NOTE: We must disable the base rule as it can report incorrect errors
    "no-use-before-define": "off",
    "no-unused-vars": "off",
    "@typescript-eslint/no-use-before-define": "off",
    "@typescript-eslint/no-unused-vars": "warn",

    "semi": [2, "always"],
    "no-extra-semi": 2,
    "semi-spacing": [2, { "before": false, "after": true }],
    "react/display-name": 1 ,
    "react/jsx-no-duplicate-props": 2,
    "react/jsx-no-undef": 2,
    "react/jsx-uses-react": 2,
    "react/jsx-uses-vars": 2,
    "react/no-danger": 0,
    "react/no-deprecated": 1,
    "react/no-did-mount-set-state": 2,
    "react/no-did-update-set-state": 2,
    "react/no-direct-mutation-state": 2,
    "react/no-is-mounted": 2,
    "react/no-unknown-property": 2,
    // "react/prop-types": 1,
    "react/react-in-jsx-scope": 2,
    "prefer-promise-reject-errors": 0,
    "comma-dangle": 0,

    // NOTE: following is temporarily disabled due to too many warnings
    // and should be fixed eventually
    "default-case": 0,
    "jsx-a11y/alt-text": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "jsx-a11y/iframe-has-title": 0,
    "jsx-a11y/anchor-has-content": 0,
    "react/jsx-no-target-blank": 0,
    "react/prop-types": 0,

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
