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
