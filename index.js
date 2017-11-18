'use strict';

const fs = require('fs');
const path = require('path');

module.exports = (name, content) => {
  if (process.argv.length != 3 || process.argv[2] != "init") {
    throw("Usage: " + process.argv[1] + " init");
  }

  if (!name) { throw "Helper name must be present."; }

  let helper_path = `spec/helpers/${name}.js`;
  if (fs.existsSync(helper_path)) {
    throw `Helper file already exists: ${helper_path}`;
  }

  let target_dir_path = path.dirname(helper_path);
  if (!fs.existsSync(target_dir_path)) {
    let dir_path_components = target_dir_path.split(path.sep);

    dir_path_components.forEach((dir, index) => {
      let dir_path = path.join.apply(null, dir_path_components.slice(0, index + 1));
      if (!fs.existsSync(dir_path)) {
        fs.mkdirSync(dir_path, 0o770);
      }
    });
  } else {
    let stat = fs.statSync(target_dir_path);

    if (!stat.isDirectory()) {
      throw `Helper target directory is not a directory: ${target_dir_path}`;
    }
  }

  fs.writeFileSync(helper_path, content, null, 0o660);
};
