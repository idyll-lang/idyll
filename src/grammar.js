// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }
var grammar = {
    ParserRules: [
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["wschar", "_$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "__$ebnf$1", "symbols": ["wschar"]},
    {"name": "__$ebnf$1", "symbols": ["wschar", "__$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": function(d) {return null;}},
    {"name": "wschar", "symbols": [/[ \t\n\v\f]/], "postprocess": id},
    {"name": "Sourcefile$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"E"}, {"literal":"O"}, {"literal":"F"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Sourcefile$ebnf$1$subexpression$1", "symbols": ["Sourcefile$ebnf$1$subexpression$1$string$1", "_"]},
    {"name": "Sourcefile$ebnf$1", "symbols": ["Sourcefile$ebnf$1$subexpression$1"]},
    {"name": "Sourcefile$ebnf$1$subexpression$2$string$1", "symbols": [{"literal":"E"}, {"literal":"O"}, {"literal":"F"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Sourcefile$ebnf$1$subexpression$2", "symbols": ["Sourcefile$ebnf$1$subexpression$2$string$1", "_"]},
    {"name": "Sourcefile$ebnf$1", "symbols": ["Sourcefile$ebnf$1$subexpression$2", "Sourcefile$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Sourcefile", "symbols": ["Blocks", "__", "Sourcefile$ebnf$1"], "postprocess": 
        function(data, location, reject) {
          return data[0];
        }
        },
    {"name": "Blocks$ebnf$1$string$1", "symbols": [{"literal":"B"}, {"literal":"R"}, {"literal":"E"}, {"literal":"A"}, {"literal":"K"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Blocks$ebnf$1", "symbols": ["Blocks$ebnf$1$string$1"], "postprocess": id},
    {"name": "Blocks$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Blocks$ebnf$2", "symbols": []},
    {"name": "Blocks$ebnf$2$subexpression$1$ebnf$1", "symbols": []},
    {"name": "Blocks$ebnf$2$subexpression$1$ebnf$1$string$1", "symbols": [{"literal":"B"}, {"literal":"R"}, {"literal":"E"}, {"literal":"A"}, {"literal":"K"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Blocks$ebnf$2$subexpression$1$ebnf$1", "symbols": ["Blocks$ebnf$2$subexpression$1$ebnf$1$string$1", "Blocks$ebnf$2$subexpression$1$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Blocks$ebnf$2$subexpression$1", "symbols": ["Blocks$ebnf$2$subexpression$1$ebnf$1", "__", "Block"]},
    {"name": "Blocks$ebnf$2", "symbols": ["Blocks$ebnf$2$subexpression$1", "Blocks$ebnf$2"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Blocks$ebnf$3$string$1", "symbols": [{"literal":"B"}, {"literal":"R"}, {"literal":"E"}, {"literal":"A"}, {"literal":"K"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Blocks$ebnf$3", "symbols": ["Blocks$ebnf$3$string$1"], "postprocess": id},
    {"name": "Blocks$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Blocks", "symbols": ["Blocks$ebnf$1", "_", "Block", "_", "Blocks$ebnf$2", "_", "Blocks$ebnf$3"], "postprocess": 
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
        },
    {"name": "Block$subexpression$1", "symbols": ["Paragraph"]},
    {"name": "Block$subexpression$1", "symbols": ["OpenComponent"]},
    {"name": "Block", "symbols": ["Block$subexpression$1"], "postprocess": 
        function(data, location, reject) {
          return data[0][0];
        }
        },
    {"name": "Paragraph$ebnf$1$subexpression$1$subexpression$1", "symbols": ["ClosedComponent"]},
    {"name": "Paragraph$ebnf$1$subexpression$1$subexpression$1$subexpression$1$string$1", "symbols": [{"literal":"W"}, {"literal":"O"}, {"literal":"R"}, {"literal":"D"}, {"literal":"S"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Paragraph$ebnf$1$subexpression$1$subexpression$1$subexpression$1", "symbols": ["Paragraph$ebnf$1$subexpression$1$subexpression$1$subexpression$1$string$1", "__", "TokenValue"]},
    {"name": "Paragraph$ebnf$1$subexpression$1$subexpression$1", "symbols": ["Paragraph$ebnf$1$subexpression$1$subexpression$1$subexpression$1"]},
    {"name": "Paragraph$ebnf$1$subexpression$1", "symbols": ["Paragraph$ebnf$1$subexpression$1$subexpression$1", "_"]},
    {"name": "Paragraph$ebnf$1", "symbols": ["Paragraph$ebnf$1$subexpression$1"]},
    {"name": "Paragraph$ebnf$1$subexpression$2$subexpression$1", "symbols": ["ClosedComponent"]},
    {"name": "Paragraph$ebnf$1$subexpression$2$subexpression$1$subexpression$1$string$1", "symbols": [{"literal":"W"}, {"literal":"O"}, {"literal":"R"}, {"literal":"D"}, {"literal":"S"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Paragraph$ebnf$1$subexpression$2$subexpression$1$subexpression$1", "symbols": ["Paragraph$ebnf$1$subexpression$2$subexpression$1$subexpression$1$string$1", "__", "TokenValue"]},
    {"name": "Paragraph$ebnf$1$subexpression$2$subexpression$1", "symbols": ["Paragraph$ebnf$1$subexpression$2$subexpression$1$subexpression$1"]},
    {"name": "Paragraph$ebnf$1$subexpression$2", "symbols": ["Paragraph$ebnf$1$subexpression$2$subexpression$1", "_"]},
    {"name": "Paragraph$ebnf$1", "symbols": ["Paragraph$ebnf$1$subexpression$2", "Paragraph$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Paragraph", "symbols": ["Paragraph$ebnf$1"], "postprocess": 
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
        },
    {"name": "OpenComponent$ebnf$1", "symbols": ["Blocks"], "postprocess": id},
    {"name": "OpenComponent$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "OpenComponent", "symbols": ["OpenComponentStart", "__", "OpenComponent$ebnf$1", "_", "OpenComponentEnd"], "postprocess": 
        function(data, location, reject) {
          return [data[0][0], data[0][1], data[2] || []];
        }
        },
    {"name": "OpenComponentStart$string$1", "symbols": [{"literal":"O"}, {"literal":"P"}, {"literal":"E"}, {"literal":"N"}, {"literal":"_"}, {"literal":"B"}, {"literal":"R"}, {"literal":"A"}, {"literal":"C"}, {"literal":"K"}, {"literal":"E"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "OpenComponentStart$string$2", "symbols": [{"literal":"C"}, {"literal":"L"}, {"literal":"O"}, {"literal":"S"}, {"literal":"E"}, {"literal":"_"}, {"literal":"B"}, {"literal":"R"}, {"literal":"A"}, {"literal":"C"}, {"literal":"K"}, {"literal":"E"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "OpenComponentStart", "symbols": ["OpenComponentStart$string$1", "__", "ComponentName", "__", "ComponentProperties", "_", "OpenComponentStart$string$2"], "postprocess": 
        function(data, location, reject) {
          return [data[2], data[4]];
        }
        },
    {"name": "OpenComponentEnd$string$1", "symbols": [{"literal":"O"}, {"literal":"P"}, {"literal":"E"}, {"literal":"N"}, {"literal":"_"}, {"literal":"B"}, {"literal":"R"}, {"literal":"A"}, {"literal":"C"}, {"literal":"K"}, {"literal":"E"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "OpenComponentEnd$string$2", "symbols": [{"literal":"F"}, {"literal":"O"}, {"literal":"R"}, {"literal":"W"}, {"literal":"A"}, {"literal":"R"}, {"literal":"D"}, {"literal":"_"}, {"literal":"S"}, {"literal":"L"}, {"literal":"A"}, {"literal":"S"}, {"literal":"H"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "OpenComponentEnd$string$3", "symbols": [{"literal":"C"}, {"literal":"L"}, {"literal":"O"}, {"literal":"S"}, {"literal":"E"}, {"literal":"_"}, {"literal":"B"}, {"literal":"R"}, {"literal":"A"}, {"literal":"C"}, {"literal":"K"}, {"literal":"E"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "OpenComponentEnd", "symbols": ["OpenComponentEnd$string$1", "__", "OpenComponentEnd$string$2", "__", "ComponentName", "__", "ComponentProperties", "_", "OpenComponentEnd$string$3"]},
    {"name": "ClosedComponent$string$1", "symbols": [{"literal":"O"}, {"literal":"P"}, {"literal":"E"}, {"literal":"N"}, {"literal":"_"}, {"literal":"B"}, {"literal":"R"}, {"literal":"A"}, {"literal":"C"}, {"literal":"K"}, {"literal":"E"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ClosedComponent$string$2", "symbols": [{"literal":"F"}, {"literal":"O"}, {"literal":"R"}, {"literal":"W"}, {"literal":"A"}, {"literal":"R"}, {"literal":"D"}, {"literal":"_"}, {"literal":"S"}, {"literal":"L"}, {"literal":"A"}, {"literal":"S"}, {"literal":"H"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ClosedComponent$string$3", "symbols": [{"literal":"C"}, {"literal":"L"}, {"literal":"O"}, {"literal":"S"}, {"literal":"E"}, {"literal":"_"}, {"literal":"B"}, {"literal":"R"}, {"literal":"A"}, {"literal":"C"}, {"literal":"K"}, {"literal":"E"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ClosedComponent", "symbols": ["ClosedComponent$string$1", "__", "ComponentName", "__", "ComponentProperties", "_", "ClosedComponent$string$2", "__", "ClosedComponent$string$3"], "postprocess": 
        function(data, location, reject) {
          return [data[2], data[4], []];
        }
        },
    {"name": "ComponentName$string$1", "symbols": [{"literal":"C"}, {"literal":"O"}, {"literal":"M"}, {"literal":"P"}, {"literal":"O"}, {"literal":"N"}, {"literal":"E"}, {"literal":"N"}, {"literal":"T"}, {"literal":"_"}, {"literal":"W"}, {"literal":"O"}, {"literal":"R"}, {"literal":"D"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ComponentName", "symbols": ["ComponentName$string$1", "__", "TokenValue"], "postprocess": 
        function(data, location, reject) {
          return data[2];
        }
        },
    {"name": "ComponentProperties$ebnf$1", "symbols": []},
    {"name": "ComponentProperties$ebnf$1$subexpression$1", "symbols": ["ComponentProperty", "_"]},
    {"name": "ComponentProperties$ebnf$1", "symbols": ["ComponentProperties$ebnf$1$subexpression$1", "ComponentProperties$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "ComponentProperties", "symbols": ["ComponentProperties$ebnf$1"], "postprocess": 
        function(data, location, reject) {
          return data[0].map(function(d) { return d[0]; });
        }
        },
    {"name": "ComponentProperty$string$1", "symbols": [{"literal":"C"}, {"literal":"O"}, {"literal":"M"}, {"literal":"P"}, {"literal":"O"}, {"literal":"N"}, {"literal":"E"}, {"literal":"N"}, {"literal":"T"}, {"literal":"_"}, {"literal":"W"}, {"literal":"O"}, {"literal":"R"}, {"literal":"D"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ComponentProperty$string$2", "symbols": [{"literal":"P"}, {"literal":"A"}, {"literal":"R"}, {"literal":"A"}, {"literal":"M"}, {"literal":"_"}, {"literal":"S"}, {"literal":"E"}, {"literal":"P"}, {"literal":"A"}, {"literal":"R"}, {"literal":"A"}, {"literal":"T"}, {"literal":"O"}, {"literal":"R"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ComponentProperty", "symbols": ["ComponentProperty$string$1", "__", "TokenValue", "__", "ComponentProperty$string$2", "__", "ComponentPropertyValue"], "postprocess": 
        function(data, location, reject) {
          var key = data[2];
          var val = data[6];
          return [key, val];
        }
        },
    {"name": "ComponentPropertyValue$subexpression$1$string$1", "symbols": [{"literal":"N"}, {"literal":"U"}, {"literal":"M"}, {"literal":"B"}, {"literal":"E"}, {"literal":"R"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ComponentPropertyValue$subexpression$1", "symbols": ["ComponentPropertyValue$subexpression$1$string$1"]},
    {"name": "ComponentPropertyValue$subexpression$1$string$2", "symbols": [{"literal":"E"}, {"literal":"X"}, {"literal":"P"}, {"literal":"R"}, {"literal":"E"}, {"literal":"S"}, {"literal":"S"}, {"literal":"I"}, {"literal":"O"}, {"literal":"N"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ComponentPropertyValue$subexpression$1", "symbols": ["ComponentPropertyValue$subexpression$1$string$2"]},
    {"name": "ComponentPropertyValue$subexpression$1$string$3", "symbols": [{"literal":"S"}, {"literal":"T"}, {"literal":"R"}, {"literal":"I"}, {"literal":"N"}, {"literal":"G"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ComponentPropertyValue$subexpression$1", "symbols": ["ComponentPropertyValue$subexpression$1$string$3"]},
    {"name": "ComponentPropertyValue$subexpression$1$string$4", "symbols": [{"literal":"C"}, {"literal":"O"}, {"literal":"M"}, {"literal":"P"}, {"literal":"O"}, {"literal":"N"}, {"literal":"E"}, {"literal":"N"}, {"literal":"T"}, {"literal":"_"}, {"literal":"W"}, {"literal":"O"}, {"literal":"R"}, {"literal":"D"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ComponentPropertyValue$subexpression$1", "symbols": ["ComponentPropertyValue$subexpression$1$string$4"]},
    {"name": "ComponentPropertyValue", "symbols": ["ComponentPropertyValue$subexpression$1", "__", "TokenValue"], "postprocess": 
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
        },
    {"name": "TokenValue$string$1", "symbols": [{"literal":"T"}, {"literal":"O"}, {"literal":"K"}, {"literal":"E"}, {"literal":"N"}, {"literal":"_"}, {"literal":"V"}, {"literal":"A"}, {"literal":"L"}, {"literal":"U"}, {"literal":"E"}, {"literal":"_"}, {"literal":"S"}, {"literal":"T"}, {"literal":"A"}, {"literal":"R"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "TokenValue$ebnf$1", "symbols": []},
    {"name": "TokenValue$ebnf$1", "symbols": [/[^\"]/, "TokenValue$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "TokenValue$string$2", "symbols": [{"literal":"T"}, {"literal":"O"}, {"literal":"K"}, {"literal":"E"}, {"literal":"N"}, {"literal":"_"}, {"literal":"V"}, {"literal":"A"}, {"literal":"L"}, {"literal":"U"}, {"literal":"E"}, {"literal":"_"}, {"literal":"E"}, {"literal":"N"}, {"literal":"D"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "TokenValue", "symbols": ["TokenValue$string$1", "__", {"literal":"\""}, "TokenValue$ebnf$1", {"literal":"\""}, "__", "TokenValue$string$2"], "postprocess": 
        function(data, location, reject) {
          return data[3].join('').replace(/&quot;/g, '"');
        }
        }
]
  , ParserStart: "Sourcefile"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
