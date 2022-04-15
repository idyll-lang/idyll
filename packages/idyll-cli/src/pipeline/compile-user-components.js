const fs = require('fs');
const { readdir, writeFile } = fs.promises;
const { ensureDir } = require('fs-extra');
const path = require('path');
const babel = require('@babel/core');

module.exports = async paths => {
  let componentDirIndex = 0;
  const tempComponentDir = path.join(paths.TMP_DIR, 'components');
  await ensureDir(tempComponentDir);
  for (const dir of paths.COMPONENT_DIRS) {
    const tempComponentSubdir = path.join(
      tempComponentDir,
      `${componentDirIndex}`
    );
    await ensureDir(tempComponentSubdir);
    const files = await readdir(dir);
    for (const file of files) {
      const { code } = await babel.transformFileAsync(path.join(dir, file), {
        presets: ['@babel/preset-react']
      });
      await writeFile(
        path.join(tempComponentSubdir, path.basename(file)),
        code,
        'utf-8'
      );
    }
    paths.COMPONENT_DIRS[componentDirIndex] = tempComponentSubdir;
    componentDirIndex++;
  }

  return paths;
};
