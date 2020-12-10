let printed = false;
module.exports = (environment = process.env.NODE_ENV) => {
    if (!printed) {
        console.log(`isDev.js :: process.env.NODE_ENV=${process.env.NODE_ENV} (set the environment variable 'NODE_ENV' to change that)`);
        printed = true;
    }
    return "development" === environment || !environment;
};
