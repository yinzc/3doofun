const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const fs = require('fs');

// App directory
const appDirectory = fs.realpathSync(process.cwd());

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        static: path.resolve(appDirectory, "public"),
        compress: true,
        hot: true,
        // publicPath: '/',
        open: true,
        // host: '0.0.0.0', // enable to access from other devices on the network
        https: true // enable when HTTPS is needed (like in WebXR)
        // proxy: {
        //     '/glb': {
        //         target: "http://cos-public.seewo.com",
        //         changeOrigin: true,
        //         secure: false,
        //         pathRewrite: { "^/glb": "" },
        //         // onProxyReq: function (proxyReq, req, res) {
        //         //     console.log(proxyReq, req, res);
        //         // },
                
        //         // onProxyRes: function (proxyRes, req, res) {
        //         //     console.log(proxyRes, req, res);
        //         // }
        //     }
        //     // '/fivefactory.glb': 'http://cos-public.seewo.com/fivefactory.glb',
        // }
    },
});