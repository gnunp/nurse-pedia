const path = require("path");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


dotenv.config({ path: path.join(__dirname, '.js_env') })


const isDevMode = (process.env.IS_DEV_MODE === 'true');
const BASE_DIRECTORY = {
    nursing_knowledges: "./static/src/nursing_knowledges/js/pages",
    users: "./static/src/users/js/pages",
}
module.exports = {
    entry: {
        global: "./static/src/global/js/global.js",

        home: `${BASE_DIRECTORY.nursing_knowledges}/home/main.js`,
        diseaseDetail : `${BASE_DIRECTORY.nursing_knowledges}/diseaseDetail/main.js`,
        diseaseDetailEdit: `${BASE_DIRECTORY.nursing_knowledges}/diseaseDetailEdit/main.js`,
        diagnosisDetail :`${BASE_DIRECTORY.nursing_knowledges}/diagnosisDetail/main.js`,
        diagnosisDetailEdit :`${BASE_DIRECTORY.nursing_knowledges}/diagnosisDetailEdit/main.js`,
        diseaseCategory:`${BASE_DIRECTORY.nursing_knowledges}/diseaseCategory/main.js`,
        diagnosisCategory:`${BASE_DIRECTORY.nursing_knowledges}/diagnosisCategory/main.js`,
        mindmapPage:`${BASE_DIRECTORY.nursing_knowledges}/mindmapPage/main.js`,
        history:`${BASE_DIRECTORY.nursing_knowledges}/history/main.js`,

        mypage:`${BASE_DIRECTORY.users}/mypage/main.js`
    },
    plugins: [
       // new BundleAnalyzerPlugin()
    ],
    mode: isDevMode ? "development" : "production",
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, 'static','build', 'js'),
        clean: true,
    },
    watch: isDevMode ? true : false,
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