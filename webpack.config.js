const path = require("path");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: {
        global: "./static/global/js/global.js",
        home: "./static/nursing_knowledges/js/home.js",

        diseasedetail : "./static/nursing_knowledges/js/disease_detail.js",
        diagnosisdetail :"./static/nursing_knowledges/js/diagnosis_detail.js",
        diseaseDetailEdit: "./static/nursing_knowledges/js/disease_detail_edit.js",
        
        userModal: "./static/users/js/userModal.js",
        kakaoSigninFormValidation: "./static/users/js/kakaoSigninFormValidation.js",


    },
    plugins: [
       // new BundleAnalyzerPlugin()
    ],
    mode: "development",
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