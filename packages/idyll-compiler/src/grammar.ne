@builtin "whitespace.ne"
@{% 
  let idCounter = 0; 
%}
Sourcefile -> Blocks "EOF" {%
  function(data, location, reject) {
    return data[0];
  }
%}

Blocks -> ("BREAK" __):* ((BreakBlock __ ("BREAK" __):+) | (NoBreakBlock __ ("BREAK" __):*)):*  (BreakBlock __):? {%
  function(data, location, reject) {
    var blocks = [];
    data[1].forEach(function(d) {
      blocks.push(d[0][0]);
    }); 
    if (data[2]) {
      blocks.push(data[2][0]);
    }
    return blocks;
  }
%}

Block -> (BreakBlock | NoBreakBlock) {%
  function(data, location, reject) {
    return data[0][0];
  }
%}

NoBreakBlock -> (Header | Quote | MultilineCode | UnorderedList | OrderedList) {%
  function(data, location, reject) {
    return data[0][0];
  }
%}

BreakBlock -> (Paragraph) {%
  function(data, location, reject) {
    return data[0][0];
  }
%}

Header -> "HEADER_" [1-6] (__ ParagraphItem):+ __ "HEADER_END" {%
  function(data, location, reject) {
    var children = [];
    data[2].map(function (child) {
      children.push(child[1]);
    });
    let header = {
      "id": idCounter++,
      "type": "component", 
      "name": "h" + data[1], 
      "children": children
    };
    console.log(JSON.stringify(header)); 
    return header;
  }
%}

Quote -> "QUOTE_START" (__ ParagraphItem):+ __ "QUOTE_END" {%
  function(data, location, reject) {
    var children = [];
    data[1].map(function (child) {
      children.push(child[1]);
    });

    return {
      "id": idCounter++, 
      "type": "component", 
      "name": "blockquote", 
      "children": children
    };
  }
%}

UnorderedList -> "UNORDERED_LIST" (__ ListItem):+ __ "LIST_END"  {%
  function(data, location, reject) {
    let ul = {
      "id": idCounter++, 
      "type": "component", 
      "name": "ul", 
    }; 
    var children = [];
    data[1].map(function (child) {
      children.push({
        "id": idCounter++, 
        "type": "component", 
        "name": "li", 
        "children": child[1]});
    });
    ul.children = children; 
    return ul; 
  }
%}

OrderedList -> "ORDERED_LIST" (__ ListItem):+ __ "LIST_END" {%
  function(data, location, reject) {
    let ol = {
      "id": idCounter++, 
      "type": "component", 
      "name": "ol", 
    };
    var children = [];
    data[1].map(function (child) {
      children.push({
        "id": idCounter++, 
        "type": "component", 
        "name": "li", 
        "children": child[1]});
    });
    ol.children = children; 
    return ol;
  }
%}

ListItem -> "LIST_ITEM" (__ ParagraphItem):+ {%
  function(data, location, reject) {
    var children = [];
    data[1].map(function (child) {
      children.push(child[1]);
    });
    return children;
  }
%}

MultilineCode -> "MULTILINE_CODE" (__ TokenValue):+ {%
  function(data, location, reject) {
    if (data[1].length > 1 && data[1][0][1].trim() !== '') {
      return {
        "id": idCounter++, 
        "type": "component", 
        "name": "CodeHighlight", 
        "properties": {
          "language": {
            "type": "value", 
            "value": data[1][0][1]
          }
        }, 
        "children": [data[1][1][1]]
      };
    } else {
      return {
        "id": idCounter++, 
        "type": "component", 
        "name": "pre", 
        "children": [
          {
            "id": idCounter++,
            "type": "component",
            "name": "code", 
            "children": [data[1][data[1].length - 1][1]]
          }
        ]
      };
    }
  }
%}

Paragraph -> (ParagraphItem __):* ParagraphItem  {%
  function(data, location, reject) {
    var children = [];
    data[0].map(function (child) {
      children.push(child[0]);
    });
    children.push(data[1]);
    var lastWasString = false;

    // If there are multiple strings split across
    // children merge them to avoid issues with
    // Equation and other components that
    // consume their children programatically.
    children = children.reduce((acc, c) => {
      if (typeof c === 'string' && lastWasString) {
        acc[acc.length - 1] += c;
        lastWasString = true;
      } else if (typeof c === 'string') {
        acc.push(c);
        lastWasString = true;
      } else {
        acc.push(c);
        lastWasString = false;
      }
      return acc;
    }, [])
    if (children.length === 1 && typeof children[0] !== 'string') {
      return children[0];
    } else if (children.filter(function (c) { return typeof c === 'string' }).length === 0) {
      return {
        "id": idCounter++, 
        "type": "component", 
        "name": "_idyllContainer", 
        "children": children
      };
    }

    return {
      "id": idCounter++, 
      "type": "component", 
      "name": "p", 
      "children": children
    };
  }
%}

ParagraphItem -> (Text | ClosedComponent | OpenComponent | TextInline) {%
  function(data, location, reject) {
    return data[0][0];
  }
%}

Text -> "WORDS" __ TokenValue {%
  function(data, location, reject) {
    return {
      "id": idCounter++, 
      "type": "textnode", 
      "value": data[2]
    }
  }
%}

TextInline -> (CodeInline | BoldInline | EmInline | LinkInline | ImageInline) {%
  function(data, location, reject) {
    return data[0][0];
  }
%}

BoldInline -> "STRONG" (__ ParagraphItem):+ __ "STRONG_END" {%
  function(data, location, reject) {
    var children = [];
    data[1].map(function (child) {
      children.push(child[1]);
    });
    return {
      "id": idCounter++, 
      "type": "component", 
      "name": "strong", 
      "children": children
    }; 
  }
%}

EmInline -> "EM" (__ ParagraphItem):+ __ "EM_END" {%
  function(data, location, reject) {
    var children = [];
    data[1].map(function (child) {
      children.push(child[1]);
    });
    return {
      "id": idCounter++, 
      "type": "component", 
      "name": "em", 
      "children": children
    };
  }
%}

CodeInline -> "INLINE_CODE" __ TokenValue {%
  function(data, location, reject) {
    return {
      "id": idCounter++, 
      "type": "component", 
      "name": "code", 
      "children": [data[2]]
    };
  }
%}

ImageInline -> "IMAGE" __ TokenValue __ TokenValue {%
  function(data, location, reject) {
    return {
      "id": idCounter++, 
      "type": "component", 
      "name": "img",
      "properties": {
        "src": {
          "type": "value", 
          "value": data[4]
        }, 
        "alt": {
          "type": "value", 
          "value": data[2]
        }
      } 
    }; 
  }
%}

LinkInline -> "LINK" __ TokenValue __ TokenValue {%
  function(data, location, reject) {
    return {
      "id": idCounter++, 
      "type": "component", 
      "name": "a",
      "properties": {
        "href": {
          "type": "value", 
          "value": data[4]
        }
      }, 
      "children": [data[2]] 
    };
  }
%}

OpenComponent -> OpenComponentStart __ Blocks:? OpenComponentEnd {%
  function(data, location, reject) {
    return {
      "id": idCounter++, 
      "type": "component", 
      "name": data[0][0], 
      "properties": data[0][1], 
      "children": data[2] || []
    }
  }
%}

OpenComponentStart -> "OPEN_BRACKET" __ ComponentName __ ComponentProperties "CLOSE_BRACKET"  {%
  function(data, location, reject) {
    return [data[2], data[4]];
  }
%}

OpenComponentEnd -> "OPEN_BRACKET" __ "FORWARD_SLASH" __ ComponentName __ "CLOSE_BRACKET"

ClosedComponent -> "OPEN_BRACKET" __ ComponentName __ ComponentProperties "FORWARD_SLASH" __ "CLOSE_BRACKET" {%
  function(data, location, reject) {
    return {
      "id" : idCounter++,
      "type" : "component",
      "name" : data[2],
      "properties" : data[4] 
    };
  }
%}

ComponentName -> "COMPONENT_NAME" __ TokenValue {%
  function(data, location, reject) {
    return data[2];
  }
%}

ComponentProperties -> (ComponentProperty __):* {%
  function(data, location, reject) {
    let properties = {}; 
    data[0].forEach((prop) => {
      properties[prop[0][0]] = {
        "type": prop[0][1], 
        "value": prop[0][2]
      }; 
    }); 
    return properties;
  }
%}

ComponentProperty -> "COMPONENT_WORD" __ TokenValue __ "PARAM_SEPARATOR" __  ComponentPropertyValue {%
  function(data, location, reject) {
    return [data[2], data[6][0], data[6][1]]; 
  }
%}

ComponentPropertyValue -> ("NUMBER" | "EXPRESSION" | "STRING" | "COMPONENT_WORD" | "BOOLEAN") __ TokenValue {%
  function(data, location, reject) {
    var t = data[0][0];
    var val = data[2];
    if (t === 'NUMBER') {
      val = +val;
    } else if (t === 'EXPRESSION' || t === 'STRING') {
      val = val.substring(1, val.length-1);
    } else if (t === 'BOOLEAN') {
      val = (val === 'true');
    }

    var typeString = '';
    if (t === 'EXPRESSION') {
      typeString = 'expression';
    } else if (t === 'NUMBER' || t === 'STRING' || t === 'BOOLEAN') {
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

