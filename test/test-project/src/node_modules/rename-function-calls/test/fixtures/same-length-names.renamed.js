'use strict';

function x() { }
function y() { }
function z() { }

var go = module.exports = function () {
  y();  
  y();
  z();

  function nested() {
    return y();
    function oneMoreLevel () {
      y(); z(); y();
    }
  }

  function nestedExpression() {
    return 1 + y();
  }
};
