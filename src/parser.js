
var Parser = require('jison').Parser;

var grammar = {
  bnf: {

    document: [
      ['blocks EOF', 'return $1;']
    ],
    blocks: [
      ['block', '$$ = [ $1 ]'],
      ['blocks block', '$$ = $1.concat([$2])']
    ],
    block: [
      ['closedComponent', '$$ = $1'],
      ['BREAK', '$$ = ["br", []]'],
      ['paragraph', '$$ = ["p", [], $1]'],
      ['openComponent', '$$ = $1'],
    ],
    paragraph: [
      ['WORDS', '$$ = [ $1 ]'],
      ['paragraph WORDS', '$$ = $1.concat([$2])'],
      // ['WORDS closedComponent WORDS', '$$ = $1'],
      // ['paragraph closedComponent', '$$ = $1.concat([$2])'],
    ],
    openComponent: [
      ['openComponentStart openComponentEnd', '$$ = $1.concat([[]])'],
      ['openComponentStart blocks openComponentEnd', '$$ = $1.concat([$2])']
    ],
    openComponentStart: [
      ['OPEN_BRACKET componentName CLOSE_BRACKET', '$$ = [$2, []]'],
      ['OPEN_BRACKET componentName componentProperties CLOSE_BRACKET', '$$ = [$2, $3]']
    ],
    openComponentEnd: [
      ['OPEN_BRACKET FORWARD_SLASH componentName CLOSE_BRACKET', '$$ = ""']
    ],
    closedComponent: [
      ['OPEN_BRACKET componentName FORWARD_SLASH CLOSE_BRACKET', '$$ = [$2, [], []]'],
      ['OPEN_BRACKET componentName componentProperties FORWARD_SLASH CLOSE_BRACKET', '$$ = [$2, $3, []]']
    ],
    componentName: [
      ['COMPONENT_WORD', '$$ = $1']
    ],
    componentProperties: [
      ['COMPONENT_WORD PARAM_SEPARATOR componentPropertyValue', '$$ = [[$1, $3]]'],
      ['componentProperties COMPONENT_WORD PARAM_SEPARATOR componentPropertyValue', '$$ = $1.concat([[$2, $4]])'],
      ['null', '$$ = []']
    ],
    componentPropertyValue: [
      ['NUMBER', '$$ = ["value", $1]'],
      ['EXPRESSION', '$$ = ["expression", $1]'],
      ['STRING', '$$ = ["value", $1]'],
      ['COMPONENT_WORD', '$$ = ["variable", $1]']
    ]
  },
  startSymbol: "document"
};


module.exports = function() {
  return new Parser(grammar);
}
