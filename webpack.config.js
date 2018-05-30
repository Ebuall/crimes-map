const path = require("path");

module.exports = {
  mode: process.env.WEBPACK_SERVE ? "development" : "production",

  output: {
    path: path.resolve(__dirname, "www"),
  },

  module: {
    noParse: /(mapbox-gl)\.js$/,
    rules: [
      {
        test: /\.css$/,
        use: [{ loader: "style-loader" }, { loader: "css-loader" }],
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
};
