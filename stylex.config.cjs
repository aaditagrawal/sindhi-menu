const path = require("path");

module.exports = {
  dev: process.env.NODE_ENV !== "production",
  runtimeInjection: false,
  enableMediaQueryOrder: true,
  treeshakeCompensation: true,
  styleResolution: "property-specificity",
  aliases: { "@/*": [path.join(__dirname, "src", "*")] },
  unstable_moduleResolution: { type: "commonJS", rootDir: __dirname },
};
