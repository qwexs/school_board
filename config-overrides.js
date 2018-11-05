const { injectBabelPlugin } = require("react-app-rewired");
const rewireSass = require('react-app-rewire-sass');

/* config-overrides.js */
module.exports = function override(config, env) {

    // config = rewireSass(config, env);

    if (env === "production") {
        console.log("⚡ Production build with Preact");

        // config = injectBabelPlugin([require("@babel/plugin-proposal-class-properties"), { loose: true }], config);
        // config = injectBabelPlugin([require("@babel/plugin-proposal-decorators"), { legacy: true }], config);
    }
    return config;
};
