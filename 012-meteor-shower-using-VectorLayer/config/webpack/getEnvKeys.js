const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const keys = require("lodash/keys");

module.exports = (rootPath = "./") => {
  const currentPath = path.join(__dirname, "../..", rootPath);

  const basePath = currentPath + ".env";

  const envPath = basePath + "." + (process.env.NODE_ENV || "development");

  const finalPath = fs.existsSync(envPath) ? envPath : basePath;

  const fileEnv = dotenv.config({ path: finalPath }).parsed;

  const envKeys = keys(fileEnv).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
    return prev;
  }, {});

  return envKeys;
};
