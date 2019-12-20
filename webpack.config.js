const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const nodeEnv = process.env.NODE_ENV || "development";
const isProd = nodeEnv === "production";

const plugins = [
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify(nodeEnv)
    }
  }),
  new HtmlWebpackPlugin({
    title: "Typescript Webpack Starter",
    template: "!!ejs-loader!src/index.html"
  }),
  new MiniCssExtractPlugin({
    filename: "[name].css",
    chunkFilename: "[id].css"
  }),
  new webpack.LoaderOptionsPlugin({
    options: {
      tslint: {
        emitErrors: true,
        failOnHint: true
      }
    }
  })
];

var config = {
  devtool: isProd ? "hidden-source-map" : "source-map",
  context: path.resolve("./src"),
  entry: {
    app: "./index.ts"
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].bundle.js"
  },
  module: {
    rules: [
      {
        enforce: "pre",
        test: /\.tsx?$/,
        exclude: [/\/node_modules\//],
        use: ["awesome-typescript-loader", "source-map-loader"]
      },
      !isProd
        ? {
            test: /\.(js|ts)$/,
            loader: "istanbul-instrumenter-loader",
            exclude: [/\/node_modules\//],
            query: {
              esModules: true
            }
          }
        : null,
      { test: /\.html$/, loader: "html-loader" },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ].filter(Boolean)
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  plugins: plugins,
  devServer: {
    contentBase: path.join(__dirname, "dist/"),
    compress: true,
    port: 3000,
    hot: true
  }
};

module.exports = config;
