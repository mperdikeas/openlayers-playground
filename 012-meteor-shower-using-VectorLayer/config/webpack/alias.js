const path = require("path");

module.exports = (rootPath = "./") => {
  const _ = pathname => path.join(__dirname, "../../", rootPath, pathname);

  return {
    i18n: _("src/i18n")
  };
};
