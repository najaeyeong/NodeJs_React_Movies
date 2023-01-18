//webpack 재설정 하는 곳 
//react cli 로 개발할때는 webpack이 자동으로 설정되지만 변경하고 싶을때 여기서 변경한다. override

const webpack = require('webpack');

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "assert": require.resolve("assert"),
        "url": require.resolve("url")
    })
    config.resolve.fallback = fallback;
    // config.plugins = (config.plugins || []).concat([
    //     new webpack.ProvidePlugin({
    //         process: 'process/browser',
    //         Buffer: ['buffer', 'Buffer']
    //     })
    // ])
     return config;
}