import type { NextConfig } from "next";
import stylexOptions from "./stylex.config.cjs";

const stylexLoader = {
  loader: "babel-loader",
  options: {
    babelrc: false,
    configFile: false,
    plugins: [["@stylexjs/babel-plugin", stylexOptions]],
  },
};

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  turbopack: {
    rules: { "*.stylex.js": { loaders: [stylexLoader], as: "*.js" } },
  },
  // Keep explicit webpack builds supported alongside the verified Turbopack scripts.
  webpack(config) {
    config.module.rules.push({ test: /\.stylex\.js$/, use: [stylexLoader] });
    return config;
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
