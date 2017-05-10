/*!
    isnumeric (v0.2.0) 15-04-2015
    (c) Lee Crossley <leee@hotmail.co.uk> (http://ilee.co.uk/)
*/
var isNumeric=function(a){return a="string"==typeof a?a.replace(/,/g,""):a,!isNaN(parseFloat(a))&&isFinite(a)&&"[object array]"!==Object.prototype.toString.call(a).toLowerCase()};"undefined"!=typeof exports&&("undefined"!=typeof module&&module.exports&&(exports=module.exports=isNumeric),exports.isNumeric=isNumeric);