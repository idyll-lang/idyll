@builtin "whitespace.ne"

Sourcefile -> Blocks __ "EOF" {%
  function(data, location, reject) {
    return data[0];
  }
%}

Blocks -> "BREAK":? _ Block _ ("BREAK":* __ Block):* _ "BREAK":? {%
  function(data, location, reject) {
    var blocks = [];
    if (data[0]) {
      blocks.push(["br", []]);
    }

    blocks.push(data[2]);

    data[4].forEach(function(d) {
      blocks.push(d[2]);
    })

    if (data[6]) {
      blocks.push(["br", []]);
    }

    return blocks;
  }
%}

Block -> (Paragraph | OpenComponent) {%
  function(data, location, reject) {
    return data[0][0];
  }
%}

Paragraph -> ((ClosedComponent | ("WORDS" __ TokenValue)) _):+  {%
  function(data, location, reject) {
    var children = [];
    data[0].forEach(function (child) {
      if (child[0][0][0] === "WORDS") {
        children.push(child[0][0][2]);
      } else {
        children.push(child[0][0]);
      }
    })

    if (children.length === 1 && typeof children[0] !== 'string') {
      return children[0];
    }
    return ["p", [], children];
  }
%}

OpenComponent -> OpenComponentStart __ Blocks:? _ OpenComponentEnd {%
  function(data, location, reject) {
    return [data[0][0], data[0][1], data[2] || []];
  }
%}

OpenComponentStart -> "OPEN_BRACKET" __ ComponentName __ ComponentProperties _ "CLOSE_BRACKET"  {%
  function(data, location, reject) {
    return [data[2], data[4]];
  }
%}

OpenComponentEnd -> "OPEN_BRACKET" __ "FORWARD_SLASH" __ ComponentName __ ComponentProperties _ "CLOSE_BRACKET"

ClosedComponent -> "OPEN_BRACKET" __ ComponentName __ ComponentProperties _ "FORWARD_SLASH" __ "CLOSE_BRACKET" {%
  function(data, location, reject) {
    return [data[2], data[4], []];
  }
%}

ComponentName -> "COMPONENT_WORD" __ TokenValue {%
  function(data, location, reject) {
    return data[2];
  }
%}

ComponentProperties -> (ComponentProperty _):* {%
  function(data, location, reject) {
    return data[0].map(function(d) { return d[0]; });
  }
%}

ComponentProperty -> "COMPONENT_WORD" __ TokenValue __ "PARAM_SEPARATOR" __  ComponentPropertyValue {%
  function(data, location, reject) {
    var key = data[2];
    var val = data[6];
    return [key, val];
  }
%}

ComponentPropertyValue -> ("NUMBER" | "EXPRESSION" | "STRING" | "COMPONENT_WORD") __ TokenValue {%
  function(data, location, reject) {
    var t = data[0][0];
    var val = data[2];
    if (t === 'NUMBER') {
      val = +val;
    } else if (t === 'EXPRESSION' || t === 'STRING') {
      val = val.substring(1, val.length-1);
    }

    var typeString = '';
    if (t === 'EXPRESSION') {
      typeString = 'expression';
    } else if (t === 'NUMBER' || t === 'STRING') {
      typeString = 'value';
    } else if (t === 'COMPONENT_WORD') {
      typeString = 'variable';
    }
    return [typeString, val];
  }
%}

TokenValue -> "TOKEN_VALUE_START" __ "\"" [^\"]:* "\"" __ "TOKEN_VALUE_END" {%
  function(data, location, reject) {
    return data[3].join('').replace(/&quot;/g, '"');
  }
%}

