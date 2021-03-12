const path = require("path");

module.exports = {
  mode: "production",
  entry: path.join(__dirname, "..", "src", "code.ts"),
  output: {
    path: path.join(__dirname, ".."),
    filename: "code.js",
  },
  module: {
    rules: [{ test: /\.ts$/, use: "ts-loader" }],
  },
};
