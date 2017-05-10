// { "from": "usage", "to": "foo" }
// this one also shows that from and to can be different lengths

'use strict';

function usage() {
  console.log('ok dude, it is really not that hard, just read the docs');
  process.exit(0);
}

function Usage() {
  // trying to confuse us?
}

function foo() {
  console.log('foobiloo');
}

return usage();
