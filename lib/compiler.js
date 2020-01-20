const logger      = require('./logger')('compiler');
const { exec }    = require('child_process');

const SKIP = {};
const COMPILERS = {
  'moon': 'moonc',
  'lua':  SKIP
};

function Compiler(extension, folder) {
  return function compile(cb) {
    if (COMPILERS[extension] === SKIP) {
      logger.verbose('skipping compilation');
      return cb();
    }

    const cmd = `${COMPILERS[extension]} ${folder}`;

    logger.info(`compiling ${extension} files`);

    exec(cmd, (err) => {
      if (err) { logger.error(err); }
      cb(err);
    });
  };
}

Compiler.supports = (ext) => !!COMPILERS[ext];

module.exports = Compiler;