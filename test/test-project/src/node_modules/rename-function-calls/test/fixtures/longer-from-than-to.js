// { "from": "xxx", "to": "x" }
'use strict';

function x() { }
function y() { }
function z() { }

var go = module.exports = function () {
  xxx();  
  y();
  z();

  function nested() {
    return xxx();
    function oneMoreLevel () {
      xxx(); z(); xxx();
    }
  }

  function nestedExpression() {
    return 1 + xxx();
  }
};
