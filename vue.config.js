const path = require('path');
const {name} = require('./package');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin


function resolve(dir) {
    return path.join(__dirname, dir);
}

const port = 81; // dev port

module.exports = {
    /**
     * You will need to set publicPath if you plan to deploy your site under a sub path,
     * for example GitHub Pages. If you plan to deploy your site to https://foo.github.io/bar/,
     * then publicPath should be set to "/bar/".
     * In most cases please use '/' !!!
     * Detail: https://cli.vuejs.org/config/#publicpath
     */
    publicPath: './',
    outputDir: 'dist',
    assetsDir: 'static',
    filenameHashing: true,
    // tweak internal webpack configuration.
    // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
    devServer: {
        // host: '150.158.155.24',
        hot: true,
        disableHostCheck: true,
        // port: 2345,
        overlay: {
            warnings: false,
            errors: true,
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
        },

        proxy: {
            '/api': {     //这里最好有一个 /
                target: 'http://150.158.155.24:2345',  // 后台接口域名
                ws: true,        //如果要代理 websockets，配置这个参数
                secure: false,  // 如果是https接口，需要配置这个参数
                changeOrigin: true,  //是否跨域
                pathRewrite:{
                    '^/api':''
                }
            }
        }
    },
    // 自定义webpack配置
    configureWebpack: {
        plugins: [
            new BundleAnalyzerPlugin()
        ],
        devtool: 'source-map',
        resolve: {
            alias: {
                '@': resolve('src'),
            },
        },
        output: {
            // 把子应用打包成 umd 库格式
            library: `${name}-[name]`,
            libraryTarget: 'umd',
            jsonpFunction: `webpackJsonp_${name}`,
        },
        externals:{
            'vue': 'Vue',
            'element-ui': 'ELEMENT',
        }
    },
};
