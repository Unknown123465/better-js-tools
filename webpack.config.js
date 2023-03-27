import path from 'path';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';

const __dirname = path.resolve();

export default {
    target: ["web"],
    entry: "./dist/index.js",
    output: {
      path: path.resolve(__dirname, "webpack"),
      filename: "index.bundle.js",
      clean: true
    },
    mode : "production",
    /*module: {
      rules: [
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader"],
          exclude: /node_modules/,
        },
      ],
    },*/
    plugins: [new CleanWebpackPlugin()]
    /*plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "src", "index.html"),
      }),
      new MiniCssExtractPlugin(),
    ],
    optimization: {
      minimizer: [
        new CssMinimizerPlugin(),
      ]
    }*/
  };