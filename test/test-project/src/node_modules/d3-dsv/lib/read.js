var fs = require("fs");

module.exports = function(file, callback) {
  if ((file += "") === "-" || !file) {
    readStdin(callback);
  } else {
    fs.readFile(file, "utf8", callback);
  }
};

function readStdin(callback) {
  var buffers = [];
  process.stdin
      .on("data", function(buffer) { buffers.push(buffer); })
      .on("end", function() { callback(null, Buffer.concat(buffers).toString("utf8")); })
      .on("error", callback);
}
