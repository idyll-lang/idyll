var request = require('../');

// Test GET request
console.dir('http://nodejs.org');
var res = request('GET', 'http://nodejs.org');

console.log(res);
console.log("Reponse Body Length: ", res.getBody().length);

// Test HTTPS POST request
console.dir('https://talk.to/');
var res = request('POST', 'http://httpbin.org/post', { body: '<body/>' });

console.log(res);
console.log("Reponse Body Length: ", res.getBody().length);

console.dir('https://apache.org');
var errored = false;
try {
  // Test unauthorized HTTPS GET request
  var res = request('GET', 'https://apache.org');
  console.log(res);
  console.log("Reponse Body: ", res.body.toString());
  errored = true;
} catch(ex) {
  console.log("Successully rejected unauthorized host: https://apache.org/");
}
if (errored)
  throw new Error('Should have rejected unauthorized https get request');


