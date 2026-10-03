const stylexOptions = require("./stylex.config.cjs");

module.exports = {
  presets: ["next/babel"],
  plugins: [["@stylexjs/babel-plugin", stylexOptions]],
};
