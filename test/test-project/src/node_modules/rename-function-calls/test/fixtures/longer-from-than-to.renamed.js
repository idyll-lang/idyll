'use strict';

function x() { }
function y() { }
function z() { }

var go = module.exports = function () {
  x();  
  y();
  z();

  function nested() {
    return x();
    function oneMoreLevel () {
      x(); z(); x();
    }
  }

  function nestedExpression() {
    return 1 + x();
  }
};
