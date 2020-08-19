const path = require("path");
const fs = require("fs");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDev = process.env.NODE_ENV === "development";

const pageNames = fs
  .readdirSync("./src/views/pages/")
  .map((pageName) => pageName.replace(".pug", ""));

const entryPointsForPages = pageNames
  .filter((pageName) =>
    fs.readdirSync(`./src/scripts`).includes(`${pageName}.js`)
  )
  .reduce(
    (acc, pageName) => ({
      ...acc,
      [pageName]: `./scripts/${pageName}.js`,
    }),
    {}
  );

const entryHtmlPlugins = pageNames.map((pageName) => {
  const chunks = ["main"];
  if (pageName in entryPointsForPages) {
    chunks.push(pageName);
  }
  return new HtmlWebpackPlugin({
    filename: pageName + ".html",
    template: `./views/pages/${pageName}.pug`,
    chunks,
  });
});

module.exports = {
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
  ],
  devServer: {
    port: 4200,
    hot: isDev,
  },

  module: {
    rules: [
      {
        test: /\.scss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
      {
        test: /\.(png|jpg|svg|jpeg|woff2|woff)$/i,
        use: ["file-loader"],
      },
      // {
      //   test: /\.html$/i,
      //   loader: "html-loader",
      // },
      {
        test: /\.pug$/i,
        use: ["pug-loader"],
      },
    ],
  },
};
