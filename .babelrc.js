module.exports = {
  "presets": [
    "@babel/preset-typescript",
    "@babel/preset-react",
    ["@babel/preset-env", {
      "useBuiltIns": "usage",
      "corejs": 3,
      "debug": false,
    }],
  ],
  "plugins": [
    [
      '@babel/plugin-transform-runtime',
      {
        'regenerator': true,
      },
    ],
    // Stage 2
    ['@babel/plugin-proposal-decorators', { 'legacy': true }],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',

    // Stage 3
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    ['@babel/plugin-proposal-class-properties', { 'loose': false }],
    '@babel/plugin-proposal-json-strings',

    '@babel/plugin-proposal-optional-chaining',
    '@babel/plugin-proposal-nullish-coalescing-operator',


    [
      "module-resolver",
      {
        "root": ["."],
        "extensions": [".js", ".jsx", ".ts", ".tsx"],
        "alias": {
          "#actions": "./src/root/actions",
          "#components": "./src/root/components",
          "#config": "./src/root/config",
          "#hooks": "./src/root/hooks",
          "#types": "./src/root/types",
          "#lang": "./src/root/lang",
          "#selectors": "./src/root/selectors",
          "#utils": "./src/root/utils",
          "#views": "./src/root/views",
          "#root": "./src/root",
        },
      },
    ],
  ],
};

