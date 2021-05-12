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

    "no-unused-vars": 0,
    "@typescript-eslint/no-unused-vars": 1,

    "no-console": 0,
    "no-use-before-define": 0,
    "@typescript-eslint/no-use-before-define": 1,

    // note you must disable the base rule as it can report incorrect errors
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": ["error"],

    "prefer-destructuring": "warn",
    "function-paren-newline": ["warn", "consistent"],
    "object-curly-newline": [2, {
      "ObjectExpression": { consistent: true },
      "ObjectPattern": { consistent: true },
      "ImportDeclaration": { consistent: true },
      "ExportDeclaration": { consistent: true },
    }],

    "import/no-unresolved": ["error", { ignore: Object.keys(pkg.peerDependencies) }],
    "import/extensions": ["off", "never"],
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],

    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-module-boundary-types": 0,

    'jsx-a11y/anchor-is-valid': ['error', {
      "components": ['Link'],
      "specialLink": ['to'],
    }],
    'jsx-a11y/label-has-for': 'warn',

    'react/prop-types': 0,
    'react/jsx-props-no-spreading': 0,
    'react/no-unused-state': 'warn',
    'react/require-default-props': ['warn', { ignoreFunctionalComponents: true }],
    'react/default-props-match-prop-types': ['warn', {
      allowRequiredDefaults: true,
    }],
    'react/jsx-indent': [2, 4],
    'react/jsx-indent-props': [2, 4],
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx', '.ts', '.tsx'] }],
    'react/forbid-prop-types': [1],
    'react/destructuring-assignment': [1, 'always', { ignoreClassFields: true }],
    'react/sort-comp': [1, {
      order: [
        'static-methods',
        'constructor',
        'lifecycle',
        'everything-else',
        'render',
      ],
    }],

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
};
