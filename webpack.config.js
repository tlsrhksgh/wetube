const path = require("path"); // import path from "path"와 동일. webpack.config.js는 모던 자바스크립트 파일이 아니라서 import 사용이 불가능 함.
const autoprefixer = require("autoprefixer");
const ExtractCSS = require("extract-text-webpack-plugin");

const MODE = process.env.WEBPACK_ENV;
const ENTRY_FILE = path.resolve(__dirname,"assets","js","main.js"); // _dirname은 현재 프로젝트 디렉토리 이름. 어디에서든 접근 가능한 node.js 전역변수
const OUTPUT_DIR = path.join(__dirname, "static");

const config = {
    entry: ["@babel/polyfill", ENTRY_FILE],
    mode: MODE,
    module: {
        rules: [
            {
                test: /\.(js)$/,
                use: [
                    {
                        loader: "babel-loader"
                    }
                ]
            },
            {
                test: /\.(scss)$/,  //SCSS loader를 실행. loader란 webpack에게 파일을 처리하는 방법을 알려주는 역할. 정규식으로 표현
                use: ExtractCSS.extract([ // 내부 plugin이 사용됨. 왜냐하면 scss파일을 일반적인 css파일로 통역해야함.
                    {
                        loader: "css-loader" //이 loader는 webpack이 CSS를 이해하도록 함.
                    },
                    {
                        loader: "postcss-loader",  // css를 받아서, 이 loader에게 주는 plugin을 가지고 CSS를 변환
                        options: {
                            plugins(){
                                return [autoprefixer({browsers: "cover 99.5%"})]
                            }
                        }
                    }, // postcss-loader는 prefix부터 잡다한 것들까지 처리해줌.
                    {
                        loader: "sass-loader" // Sass혹은 SCSS를 받아서 일반적인 CSS로 바꿔 줌.
                    } // webpack은 config파일을 밑에서 위로 읽어들이므로 참고.
                ])
            }
        ]
    },
    output: {
        path: OUTPUT_DIR,
        filename: "[name].js"
    },
    plugins: [new ExtractCSS("styles.css")]
};

module.exports = config; // babel 적용이 안되기 때문에 옛날 js 문법으로 사용. export default 와 동일