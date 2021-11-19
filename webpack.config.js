const path = require("path");

module.exports = {
    entry: {
        global: "./static/global/js/global.js",
        home: "./static/nursing_knowledges/js/home.js",
        test: "./static/nursing_knowledges/js/test.js",
        userModal: "./static/users/js/userModal.js",
        kakaoSigninFormValidation: "./static/users/js/kakaoSigninFormValidation.js",
    },
    mode: "development",
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
        ]
    },
    experiments: {
        topLevelAwait: true,
    }
}