const path = require("path");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

dotenv.config({ path: path.join(__dirname, '.js_env') })

module.exports = {
    entry: {
        global: "./static/global/js/global.js",
        animation: "./static/global/js/animation.js",
        search: "./static/global/js/search.js",
        home: "./static/nursing_knowledges/js/home.js",

        diseasedetail : "./static/nursing_knowledges/js/disease_detail.js",
        diseaseDetailEdit: "./static/nursing_knowledges/js/disease_detail_edit.js",
        diagnosisdetail :"./static/nursing_knowledges/js/diagnosis_detail.js",
        diagnosisDetailEdit :"./static/nursing_knowledges/js/diagnosis_detail_edit.js",
        diagnosisdetail__relatedDiagnosisEvent :"./static/nursing_knowledges/js/diagnosis_detail__relatedDiagnosisEvent.js",
        
        userModal: "./static/users/js/userModal.js",

        diseasecategory:"./static/nursing_knowledges/js/disease_category",
        diagnosiscategory:"./static/nursing_knowledges/js/diagnosis_category",

        mypage:"./static/users/js/mypage.js",

        mindmappage:"./static/nursing_knowledges/js/mindmappage.js",

        history:"./static/nursing_knowledges/js/history.js",
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
    // mindmap때문에 적음
    devServer:{
        contentBase: path.resolve("./static/assets/js"),
        index: "./nursing_knowledges/secondpage.html",
        port: 9000
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
                test:/\.css$/,
                use:[
                    'style-loader',
                    'css-loader'
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