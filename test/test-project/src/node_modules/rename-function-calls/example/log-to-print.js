var code = [ 
    'function log(s)   { console.error(s); }'
  , 'function print(s) { console.log(s); }'
  , 'print(\'hello\');'
  , 'log(\'world\');'
].join('\n')

var rename = require('../');
var renamed = rename('log', 'print', code)
console.log(renamed);
