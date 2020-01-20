#!/usr/bin/env node

const gaze        = require('gaze');
const Queue       = require('queue');
const logger      = require('./logger')('watch');

function noop(cb) {
  cb();
}

function watch(sources, preprocessors = [], notifyEnd) {
  let success = true;
  let queue   = Queue({ concurrency: 1, autostart: true });

  const onComplete = (cb) => {
    notifyEnd();
    cb();
  };

  queue.on('success', function (result, job) {
    if (success) {
      success = false;
      logger.info('done');
      queue.push(onComplete); // trigger the callback by adding it to the queue
    }
  });

  const startProcessing = () => {
    success = true;

    logger.info(`running preprocessors`);
    preprocessors.forEach(pp => {
      const action = (cb) => {
        pp((err) => {
          // Errors will stop the queue, we simply mark this round as failed
          if (err) { success = false; }
          cb();
        });
      };

      queue.push(action);
    });

    // In the event no preprocessor is passed on, this allows the queue to be triggered regardless
    queue.push(noop);
  };

  logger.info(`watching ${sources}`);

  gaze(sources, function(err) {
    if (err) {
      logger.error(err);
      process.exit(1);
    }

    this.on('all', function(event, filepath) {
      logger.info(filepath.replace(sources, '') + ' was ' + event);
      startProcessing();
    });
  });

  startProcessing();
};

module.exports = { watch };
