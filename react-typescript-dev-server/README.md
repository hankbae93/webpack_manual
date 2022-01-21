# Install Webpack Dev Dependencies

        npm i webpack webpack-cli -D
        npm i --save-dev webpack webpack-cli

package.json

```json
{
    ...
    "scripts": {
        "build": "webpack"
    },
    "devDependencies": {
        "webpack": "^5.66.0",
        "webpack-cli": "^4.9.1"
    },
}
```

빌드 스크립트를 작성하고 실행해보면 "Can't resolve './src' in ...." 이런 메세지를 확인할 수 있다.

src 폴더와 그 안에 index.js 파일을 만들어보자

```js
console.log("HELL");
```

다시 npm run build를 해보면 dist라는 폴더에 main.js가 생긴 것을 볼 수 있다.

<br />

# Configure Webpack

이제 webpack.config.js 파일을 생성해주자.

```js
const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};
```

# Create Home page

src/index.html 생성

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>웹팩 리액트 타입스크립트</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

이제 HtmlWebpackPlugin으로 번들링된 스크립트를 이 html에 연동해준다.

    npm i html-webpack-plugin -D

webpack.config.js

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      hash: true, // This is useful for cache busting
      // filename: "../index.html", 기본적으로 index.html의 이름으로 생성하게 되어있다.
    }),
  ],
};
```

이제 npm run build를 하면 dist폴더에 스크립트와 html이 번들링된 index.html을 확인할 수 있다.

```html
<!DOCTYPE html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>웹팩 리액트 타입스크립트</title>
    <script defer="defer" src="bundle.js?05fc41fe901bd71d5f0e"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>
```

# Install React

    npm i react react-dom

이제 src/index.js를 우리가 자주 보던 리액트의 index.js로 바꾸고자 한다.

```jsx
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

ReactDOM.render(<App />, document.getElementById("root"));
```

src/App.js

```jsx
import React, { useEffect, useState } from "react";

const App = () => {
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoad(true);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return <h1>{load ? "HOME" : "LOADING..."}</h1>;
};

export default App;
```

이제 npm run build를 해보면 해당 에러메세지가 나온다.

    You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
    | import App from "./App";
    |
    > ReactDOM.render(<App />, document.getElementById("root"));
    |

jsx를 컴파일할 loader를 설치해달라는 내용인데 Babel을 설치하자.

    npm i -D @babel/core @babel/preset-env @babel/preset-react babel-loader

그 후 바벨 설정을 위해 ".babelrc.js" 파일을 생성하자.

.babelrc.js

```js
module.exports = {
  presets: ["@babel/preset-react", "@babel/preset-env"],
};
```

그 다음 추가적으로 webpack.config.js의 module에 바벨을 세팅해준다.

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },

  output: {
    filename: "bundle.js",
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      hash: true,
    }),
  ],
};
```

npm run build를 해보면 이제 우리의 리액트 파일이 제대로 번들링되어 동작하는 것을 볼 수 있다.

<br />

# Install Typescript

    npm i -D typescript @types/react @types/react-dom ts-loader
    타이핑 라이브러리 추가 설치
    많이 쓰는 awesome-typescript-loader는 webpack@4버전부터 ts-loader로 대체되엇다.

    npx tsc --init => tsconfig 파일 생성

tsconfig.json

```json
{
  "compilerOptions": {
    "target": "es5", // es5로 컴파일
    "module": "commonjs",
    "jsx": "react",
    "strict": true,
    "esModuleInterop": true, // export를 export default처럼 변경해줌
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

그리고 webpack.config.js도 세팅해주자

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: "./src/index.tsx",

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(ts|tsx)?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: [".ts", ".js", ".json", ".tsx"],
  },
  output: {
    filename: "bundle.js",
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      hash: true,
    }),
  ],
};
```

그리고 src폴더안에 있는 js, jsx파일들을 tsx로 바꾸자.

src/App.tsx

```tsx
import React, { useEffect, useState } from "react";

const App: React.FC = () => {
  const [load, setLoad] = useState<boolean>(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoad(true);
    }, 2000);
    return () => clearTimeout(timeout);
  }, []);

  return <h1>{load ? `HOME ${getRandomNumber()}` : "LOADING..."}</h1>;

  function getRandomNumber(): number {
    return Math.random() * 9;
  }
};

export default App;
```

npm run build 해보면 이상없이 돌아가는 것을 확인할 수 있다.

# Install web dev server and react-hot-load

    npm i react-hot-loader
    npm i webpack-dev-server -D

마지막으로 우리가 저장하면 알아서 refresh해주는 dev 서버를 세팅하자.

설치 후 webpack.config.js에 dev서버설정을 적어주자.

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "source-map",
  entry: "./src/index.tsx",

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(ts|tsx)?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },

  resolve: {
    extensions: [".ts", ".js", ".json", ".tsx"],
  },
  output: {
    filename: "bundle.js",
  },

  devServer: {
    port: 3000,
    open: true,
    hot: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "src/index.html",
      hash: true,
    }),
  ],
};
```

package.json

```json
{
    ...
    "scripts": {
        "build": "webpack",
        "dev": "webpack serve" // 예전에는 webpack-dev-server로 실행햇다.
    },
    ...
}
```

npm run dev 후 코드를 변경해보면 실시간으로 업데이트되는 것을 확인해볼 수 있다.
