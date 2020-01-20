const path = require('path');

module.exports = (folder, extension) => {
  return path.join(folder, `**/*.${extension}`);
};