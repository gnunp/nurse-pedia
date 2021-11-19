const path = require("path");

module.exports = {
    entry: {
        global: "./static/global/js/global.js",
        home: "./static/nursing_knowledges/js/home.js",
        secondpage:"./static/nursing_knowledges/js/secondpage.js",
        userModal: "./static/users/js/userModal.js",
    },
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