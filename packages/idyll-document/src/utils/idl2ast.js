const compiler = require('idyll-compiler')
const fs = require('fs')
const { join } = require('path')
const { splitAST, translate } = require('./index')

fs.writeFileSync(
  join(__dirname, 'ast.json'),
  JSON.stringify(
    compiler(fs.readFileSync(join(__dirname, 'src.idl'), 'utf8')),
    null,
    2
  ),
  'utf8'
)

fs.writeFileSync(
  join(__dirname, 'schema.json'),
  JSON.stringify(
    translate(
      splitAST(
        JSON.parse(fs.readFileSync(join(__dirname, 'ast.json'), 'utf8'))
      ).elements
    ),
    null,
    2
  ),
  'utf8'
)
