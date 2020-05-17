module.exports = {
  "presets": ["react-app"],
  "plugins": [
    [
      "module-resolver",
      {
        "root": ["."],
        "extensions": [".js", ".jsx", ".ts", ".tsx"],
        "alias": {
          "#actions": "./src/root/actions",
          "#components": "./src/root/components",
          "#config": "./src/config",
          "#hooks": "./src/root/hooks",
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

