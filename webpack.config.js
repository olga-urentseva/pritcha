require("dotenv").config();

const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const fetchNewses = require("./src/build/fetch_newses");

const entryPointsForPages = fs
  .readdirSync(`./src/pages`)
  .filter((pageName) =>
    fs.readdirSync(`./src/pages/${pageName}`).includes("script.js")
  )
  .reduce(
    (acc, pageName) => ({
      ...acc,
      [pageName]: `./pages/${pageName}/script.js`,
    }),
    {}
  );

module.exports = async () => {
  const newses = await fetchNewses();

  const templateParameters = {
    news: { newses },
    index: { newses },
  };

  const entryHtmlPlugins = fs.readdirSync("./src/pages/").map((pageName) => {
    const chunks = ["main"];
    if (pageName in entryPointsForPages) {
      chunks.push(pageName);
    }
    return new HtmlWebpackPlugin({
      filename: pageName + ".html",
      template: `./pages/${pageName}/template.pug`,
      chunks,
      templateParameters: templateParameters[pageName] || {},
    });
  });

  return {
    context: path.resolve(__dirname, "src"),
    mode: "development",
    entry: {
      main: "./main.js",
      ...entryPointsForPages,
    },
    output: {
      filename: "[name].[contenthash].js",
      path: path.resolve(__dirname, "dist"),
    },
    plugins: [
      ...entryHtmlPlugins,
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
      }),
      new CopyPlugin({
        patterns: [{ from: "static", to: "../dist" }],
      }),
    ],
    devServer: {
      port: 4200,
    },

    module: {
      rules: [
        {
          test: /\.scss$/i,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
        },
        {
          test: /\.(png|jpg|svg|jpeg|woff2|woff|webp)$/i,
          use: ["file-loader"],
        },
        {
          test: /\.pug$/i,
          use: ["pug-loader"],
        },
        {
          test: /\.js$/i,
          use: ["babel-loader"],
        },
      ],
    },
  };
};
