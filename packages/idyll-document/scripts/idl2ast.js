const compiler = require('idyll-compiler')
const fs = require('fs')
const { join } = require('path')
const { translate } = require('../dist/cjs/utils/index')

const fixtures = join(
  __dirname,
  '..',
  'test',
  'fixtures'
)


compiler(fs.readFileSync(join(fixtures, 'src.idl'), 'utf8'))
  .then((ast) => {
    fs.writeFileSync(
      join(fixtures, 'ast.json'),
      JSON.stringify(
        ast,
        null,
        2
      ),
      'utf8'
    )
    fs.writeFileSync(
      join(fixtures, 'schema.json'),
      JSON.stringify(
        translate(
          JSON.parse(fs.readFileSync(join(fixtures, 'ast.json'), 'utf8'))
        ),
        null,
        2
      ),
      'utf8'
    )
  })



