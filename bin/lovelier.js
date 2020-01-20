#!/usr/bin/env node

const program     = require('commander');
const { version } = require('../package.json');
const { watch }   = require('../lib/watch');
const Love        = require('../lib/love');
const Compiler    = require('../lib/compiler');
const glob        = require('../lib/glob');
const logger      = require('../lib/logger')('lovelier');

program
  .name('lovelier')
  .version(version)
  .option('-m, --moon', 'use moonscript')
  .option('-b, --bin <path>', 'love binary path');

program
  .command('dev <folder>')
  .description('run the game in development mode')
  .action((folder) => {
    const { moon, bin }  = program.opts();
    const extension = moon ? 'moon' : 'lua';
    const game      = Love(folder, { bin });
    const compile   = Compiler(extension, folder);

    logger.info('running game in development mode');
    watch(glob(folder, extension), [ compile ], () => {
      logger.info('restarting game');
      game.restart()
    });
  });

program.parse(process.argv);
