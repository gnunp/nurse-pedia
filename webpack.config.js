const path = require("path");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

dotenv.config({ path: path.join(__dirname, '.js_env') })

module.exports = {
    entry: {
        global: "./static/global/js/global.js",

        home: "./static/nursing_knowledges/js/pages/home/main.js",
        diseaseDetail : "./static/nursing_knowledges/js/pages/diseaseDetail/main.js",
        diseaseDetailEdit: "./static/nursing_knowledges/js/pages/diseaseDetailEdit/main.js",
        diagnosisDetail :"./static/nursing_knowledges/js/pages/diagnosisDetail/main.js",
        diagnosisDetailEdit :"./static/nursing_knowledges/js/pages/diagnosisDetailEdit/main.js",
        diseaseCategory:"./static/nursing_knowledges/js/pages/diseaseCategory/main.js",
        diagnosisCategory:"./static/nursing_knowledges/js/pages/diagnosisCategory/main.js",
        mindmapPage:"./static/nursing_knowledges/js/pages/mindmapPage/main.js",
        history:"./static/nursing_knowledges/js/pages/history/main.js",

        mypage:"./static/users/js/pages/mypage/main.js",
    },
    plugins: [
       // new BundleAnalyzerPlugin()
    ],
    mode: process.env.DEVELOPMENT_MODE === "local" ? "development" : "production",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'static','assets', 'js'),
        clean: true,
    },
    watch: true, 
    module: {
        rules:[
            {
                test: /\.js$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [["@babel/preset-env", { targets: "defaults" }]],
                        compact: false,
                    },
                },
            },
            {
                test:/\.scss$/,
                use:[
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type : 'asset/resource',
            }
        ]
    },
    experiments: {
        topLevelAwait: true,
    }
}