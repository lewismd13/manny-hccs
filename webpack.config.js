// eslint-disable-next-line
const path = require("path");

// eslint-disable-next-line no-undef
module.exports = {
  entry: {
    // Point "entry" to scripts you want to be CLI-eligible.
    mannyLoop: "./src/hccs.ts",
    hccsAscend: "./src/hccsAscend.ts",
    // hccsLibrams: "./src/hccsLibrams.ts",
    hccsPre: "./src/hccsPre.ts",
    // macroConsult: "./src/macroConsult.ts",
  },
  mode: "production",
  devtool: false,
  output: {
    // Change the final string here to the name you want your script to use in mafia.
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, "KoLmafia", "scripts", "manny-hccs"),
    filename: "[name].js",
    libraryTarget: "commonjs",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  module: {
    rules: [
      {
        // Include ts, tsx, js, and jsx files.
        test: /\.(ts|js)x?$/,
        // exclude: /node_modules/,
        loader: "babel-loader",
      },
    ],
  },
  optimization: {
    // Disable compression because it makes debugging more difficult for KolMafia
    minimize: false,
  },
  performance: {
    // Disable the warning about assets exceeding the recommended size because this isn't a website script
    hints: false,
  },
  plugins: [],
  externals: {
    // Add any ASH scripts you would like to use here.
    kolmafia: "commonjs kolmafia",
  },
};
