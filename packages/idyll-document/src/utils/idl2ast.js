const compiler = require('idyll-compiler')
const fs = require('fs')
const { join } = require('path')

fs.writeFileSync(
  join(__dirname, 'ast.json'),
  JSON.stringify(
    compiler(fs.readFileSync(join(__dirname, 'src.idl'), 'utf8')),
    null,
    2
  ),
  'utf8'
)
