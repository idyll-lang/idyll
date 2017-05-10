var request = require('../');

// Test GET request
console.log('GET', 'http://localhost:3030/internal-test');
var res = request('GET', 'http://localhost:3030/internal-test', {timeout: 2000});

console.log(res);
console.log("Reponse Body Length: ", res.getBody().length);

// Test HTTPS POST request
console.log('POST', 'http://localhost:3030/internal-test');
var res = request('POST', 'http://localhost:3030/internal-test', {timeout: 2000, body: '<body/>' });

console.log(res);
console.log("Reponse Body Length: ", res.getBody().length);

// Test PUT request
console.log('PUT', 'http://localhost:3030/internal-test');
var res = request('PUT', 'http://localhost:3030/internal-test', {timeout: 2000, body: '<body/>' });

console.log(res);
console.log("Reponse Body Length: ", res.getBody().length);

// Test HTTPS DELETE request
console.log('DELETE', 'http://localhost:3030/internal-test');
var res = request('DELETE', 'http://localhost:3030/internal-test', {timeout: 2000});

console.log(res);
console.log("Reponse Body Length: ", res.getBody().length);

