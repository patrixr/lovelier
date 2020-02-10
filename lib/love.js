const logger                    = require('./logger')('love');
const { spawn, execSync }       = require('child_process');
const { crossEnv }              = require('./cross');

module.exports = function (folder, opts = {}) {
  let child     = null;
  let firstRun  = true;

  const { bin = 'love' } = opts;

  const safe = (fn) => {
    try { fn() } catch(e) {}
  }

  const spawnLove = crossEnv()
    /* --- MACOS --- */
    .on('darwin', () => {
      let args = [ '-W', '-n', '-a', bin, '--args', folder, '--console' ];
      if (!firstRun) { args.unshift('-j'); }

      return spawn('open', args);
    })
    /* --- Others --- */
    .on('_', () => spawn(bin, [folder]))
    .build();

  const killLove = crossEnv()
    /* --- MACOS --- */
    .on('darwin', (child) => {
      child.kill();
      safe(() => execSync('killall love'));
    })
    /* --- Others --- */
    .on('_', (child) => child.kill())
    .build();

  const stop = () => {
    if (child) {
      killLove(child);
      child = null;
    }
  };

  const start = () => {
    stop();
    // $ open -n -j -a love --args <FOLDER>
    child = spawnLove();
    child.stderr.on('data', (data) => { logger.error(data.toString()); });
    child.stdout.on('data',  (data) => { logger.verbose(data.toString()); });

    firstRun = false;
  };

  const restart = start;

  ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException'].forEach((sig) => {
    process.on(sig, () => {
      stop();
      process.exit(1);
    });
  });

  return { start, stop, restart };
};
