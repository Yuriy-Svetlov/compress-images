const compressImages = require("./index");

const EMPTY_ENGINE = { engine: false, command: false };

const STANDARD_PARAMS = {
  compress_force: false,
  statistic: true,
  autoupdate: true,
};

const ENGINES = ["jpg", "png", "svg", "gif"];

const constructParams = (options) => {
  const args = [];

  args.push(options.source);
  args.push(options.destination);
  args.push(options.params || STANDARD_PARAMS);
  args.push(options.globOptions || false);

  const inputEngines = options.enginesSetup;

  if (!inputEngines || !Object.keys(inputEngines).length) {
    console.error("You have to specify atleast one engine!");
    process.exit(1);
  }

  for (const engine of ENGINES) {
    let data;

    if (inputEngines[engine]) {
      data = inputEngines[engine];
    } else {
      data = { ...EMPTY_ENGINE };
    }

    args.push({ [engine]: data });
  }

  return [args, options.onProgress];
};

const compress = (options) => {
  const [params, callback] = constructParams(options);
  const errors = [];
  const statistics = [];

  return new Promise((res) => {
    compressImages(...params, (error, completed, statistic) => {
      if (error) {
        errors.push(error);
      }

      statistics.push(statistic);

      if (callback) callback(error, statistic, completed);

      if (completed) res({ statistics, errors });
    });
  });
};

module.exports = { compress };
