'use strict';

function x() { }
function y() { }
function z() { }

var go = module.exports = function () {
  theY();  
  y();
  z();

  function nested() {
    return theY();
    function oneMoreLevel () {
      theY(); z(); theY();
    }
  }

  function nestedExpression() {
    return 1 + theY();
  }
};
