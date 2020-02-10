function has(arr, str) {
  return arr.indexOf(str) >= 0;
}

function crossEnv() {
  let calls = [];

  let ref = {};

  ref['on'] = (...args) => {
    const platforms = args.slice(0, -1);
    const fn        = args.slice(-1)[0];
    calls.push({ platforms, fn });
    return ref;
  }

  ref['build'] = () => {
    for (let {platforms, fn} of calls) {
      if (has(platforms, process.platform) || has(platforms, '_')) {
        return fn;
      }
    }
    return null;
  };

  return ref;
};

module.exports = { crossEnv };