// const {injectBabelPlugin} = require("react-app-rewired");
// const rewireSass = require('react-app-rewire-sass');
// const rewired = require('react-app-rewired');

/* config-overrides.js */
module.exports = function override(config, env) {

    // config = rewireSass(config, env);

    // const cssLoader = rewired.getLoader(
    //     config.module.rules,
    //     rule => rule.test && String(rule.test) === String(/\.css$/)
    // );
    //
    // const sassLoader = {
    //     test: /\.scss$/,
    //     use: [...(cssLoader.loader || cssLoader.use), 'sass-loader']
    // };
    //
    // const oneOf = config.module.rules.find(rule => rule.oneOf).oneOf;
    // oneOf.unshift(sassLoader);

    if (env === "production") {
        console.log("⚡ Production build");

        // config = injectBabelPlugin([require("@babel/plugin-proposal-class-properties"), { loose: true }], config);
        // config = injectBabelPlugin([require("@babel/plugin-proposal-decorators"), { legacy: true }], config);
    }
    return config;
};
