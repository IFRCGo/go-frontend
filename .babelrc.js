module.exports = {
  "presets": [
    "react-app",
    ['@babel/preset-env', {
      'useBuiltIns': 'usage',
      'corejs': 3,
      'debug': false,
    }],
  ],
  "plugins": [
    ['@babel/plugin-proposal-class-properties', { 'loose': false }],
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
          "#lang": "./src/lang",
          "#root": "./src/root",
          "#selectors": "./src/root/selectors",
          "#utils": "./src/root/utils",
          "#views": "./src/root/views",
        },
      },
    ],
  ],
};

