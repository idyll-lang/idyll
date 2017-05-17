const {
  dirname,
  isAbsolute,
  join,
  parse,
} = require('path');
const changeCase = require('change-case');
const pathBuilder = require('./path-builder');
const pipeline = require('./pipeline');

require('babel-core/register')({
    presets: ['react']
});

const idyll = (options = {}, cb) => {
  const opts = Object.assign({}, {
      watch: false,
      components: 'components',
      datasets: 'data',
      minify: true,
      defaultComponents: join('components', 'default'),
      layout: 'blog',
      output: 'build',
      template: '_index.html',
      theme: 'idyll',
      compilerOptions: {
        spellcheck: true
      },
    },
    options
  );
  if (opts.watch) opts.minify = false; // speed!

  const paths = pathBuilder(opts);

  const inputPkg = require(paths.PKG_FILE);
  const inputConfig = (inputPkg.idyll || {components: {}});
  for (let key in inputConfig.components) {
    inputConfig.components[changeCase.paramCase(key)] = inputConfig.components[key];
    delete inputConfig.components[key];
  };

  pipeline
    .build(opts, paths, inputConfig)
    .then(pipeline.watch.bind(null, opts, paths, inputConfig, cb))
    .then((artifacts) => {
      if (cb) cb(artifacts);
    })
    .catch((error) => {
      console.log(error.message || error);
    });
};

module.exports = idyll;
