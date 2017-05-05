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
    {"name": "Sourcefile$string$1", "symbols": [{"literal":"E"}, {"literal":"O"}, {"literal":"F"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Sourcefile", "symbols": ["Blocks", "Sourcefile$string$1"], "postprocess": 
        function(data, location, reject) {
          return data[0];
        }
        },
    {"name": "Blocks$ebnf$1", "symbols": []},
    {"name": "Blocks$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"B"}, {"literal":"R"}, {"literal":"E"}, {"literal":"A"}, {"literal":"K"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Blocks$ebnf$1$subexpression$1", "symbols": ["Blocks$ebnf$1$subexpression$1$string$1", "__"]},
    {"name": "Blocks$ebnf$1", "symbols": ["Blocks$ebnf$1$subexpression$1", "Blocks$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Blocks$ebnf$2", "symbols": []},
    {"name": "Blocks$ebnf$2$subexpression$1$subexpression$1$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"B"}, {"literal":"R"}, {"literal":"E"}, {"literal":"A"}, {"literal":"K"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Blocks$ebnf$2$subexpression$1$subexpression$1$ebnf$1$subexpression$1", "symbols": ["Blocks$ebnf$2$subexpression$1$subexpression$1$ebnf$1$subexpression$1$string$1", "__"]},
    {"name": "Blocks$ebnf$2$subexpression$1$subexpression$1$ebnf$1", "symbols": ["Blocks$ebnf$2$subexpression$1$subexpression$1$ebnf$1$subexpression$1"]},
    {"name": "Blocks$ebnf$2$subexpression$1$subexpression$1$ebnf$1$subexpression$2$string$1", "symbols": [{"literal":"B"}, {"literal":"R"}, {"literal":"E"}, {"literal":"A"}, {"literal":"K"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Blocks$ebnf$2$subexpression$1$subexpression$1$ebnf$1$subexpression$2", "symbols": ["Blocks$ebnf$2$subexpression$1$subexpression$1$ebnf$1$subexpression$2$string$1", "__"]},
    {"name": "Blocks$ebnf$2$subexpression$1$subexpression$1$ebnf$1", "symbols": ["Blocks$ebnf$2$subexpression$1$subexpression$1$ebnf$1$subexpression$2", "Blocks$ebnf$2$subexpression$1$subexpression$1$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Blocks$ebnf$2$subexpression$1$subexpression$1", "symbols": ["BreakBlock", "__", "Blocks$ebnf$2$subexpression$1$subexpression$1$ebnf$1"]},
    {"name": "Blocks$ebnf$2$subexpression$1", "symbols": ["Blocks$ebnf$2$subexpression$1$subexpression$1"]},
    {"name": "Blocks$ebnf$2$subexpression$1$subexpression$2$ebnf$1", "symbols": []},
    {"name": "Blocks$ebnf$2$subexpression$1$subexpression$2$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"B"}, {"literal":"R"}, {"literal":"E"}, {"literal":"A"}, {"literal":"K"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Blocks$ebnf$2$subexpression$1$subexpression$2$ebnf$1$subexpression$1", "symbols": ["Blocks$ebnf$2$subexpression$1$subexpression$2$ebnf$1$subexpression$1$string$1", "__"]},
    {"name": "Blocks$ebnf$2$subexpression$1$subexpression$2$ebnf$1", "symbols": ["Blocks$ebnf$2$subexpression$1$subexpression$2$ebnf$1$subexpression$1", "Blocks$ebnf$2$subexpression$1$subexpression$2$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Blocks$ebnf$2$subexpression$1$subexpression$2", "symbols": ["NoBreakBlock", "__", "Blocks$ebnf$2$subexpression$1$subexpression$2$ebnf$1"]},
    {"name": "Blocks$ebnf$2$subexpression$1", "symbols": ["Blocks$ebnf$2$subexpression$1$subexpression$2"]},
    {"name": "Blocks$ebnf$2", "symbols": ["Blocks$ebnf$2$subexpression$1", "Blocks$ebnf$2"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Blocks$ebnf$3$subexpression$1", "symbols": ["BreakBlock", "__"]},
    {"name": "Blocks$ebnf$3", "symbols": ["Blocks$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "Blocks$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Blocks", "symbols": ["Blocks$ebnf$1", "Blocks$ebnf$2", "Blocks$ebnf$3"], "postprocess": 
        function(data, location, reject) {
          var blocks = [];
          data[1].forEach(function(d) {
            blocks.push(d[0][0]);
          })
        
          if (data[2]) {
            blocks.push(data[2][0]);
          }
          return blocks;
        }
        },
    {"name": "Block$subexpression$1", "symbols": ["BreakBlock"]},
    {"name": "Block$subexpression$1", "symbols": ["NoBreakBlock"]},
    {"name": "Block", "symbols": ["Block$subexpression$1"], "postprocess": 
        function(data, location, reject) {
          return data[0][0];
        }
        },
    {"name": "NoBreakBlock$subexpression$1", "symbols": ["Header"]},
    {"name": "NoBreakBlock$subexpression$1", "symbols": ["Fence"]},
    {"name": "NoBreakBlock$subexpression$1", "symbols": ["UnorderedList"]},
    {"name": "NoBreakBlock$subexpression$1", "symbols": ["OrderedList"]},
    {"name": "NoBreakBlock", "symbols": ["NoBreakBlock$subexpression$1"], "postprocess": 
        function(data, location, reject) {
          return data[0][0];
        }
        },
    {"name": "BreakBlock$subexpression$1", "symbols": ["Paragraph"]},
    {"name": "BreakBlock", "symbols": ["BreakBlock$subexpression$1"], "postprocess": 
        function(data, location, reject) {
          return data[0][0];
        }
        },
    {"name": "Header$string$1", "symbols": [{"literal":"H"}, {"literal":"E"}, {"literal":"A"}, {"literal":"D"}, {"literal":"E"}, {"literal":"R"}, {"literal":"_"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Header", "symbols": ["Header$string$1", /[1-6]/, "__", "TokenValue"], "postprocess": 
        function(data, location, reject) {
          return ["h" + data[1], [], [data[3]]];
        }
        },
    {"name": "UnorderedList$string$1", "symbols": [{"literal":"U"}, {"literal":"N"}, {"literal":"O"}, {"literal":"R"}, {"literal":"D"}, {"literal":"E"}, {"literal":"R"}, {"literal":"E"}, {"literal":"D"}, {"literal":"_"}, {"literal":"L"}, {"literal":"I"}, {"literal":"S"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "UnorderedList$ebnf$1$subexpression$1", "symbols": ["__", "TokenValue"]},
    {"name": "UnorderedList$ebnf$1", "symbols": ["UnorderedList$ebnf$1$subexpression$1"]},
    {"name": "UnorderedList$ebnf$1$subexpression$2", "symbols": ["__", "TokenValue"]},
    {"name": "UnorderedList$ebnf$1", "symbols": ["UnorderedList$ebnf$1$subexpression$2", "UnorderedList$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "UnorderedList", "symbols": ["UnorderedList$string$1", "UnorderedList$ebnf$1"], "postprocess": 
        function(data, location, reject) {
          var children = [];
          data[1].map(function (child) {
            children.push(["li", [], [child[1]]]);
          });
          return ["ul", [], children];
        }
        },
    {"name": "OrderedList$string$1", "symbols": [{"literal":"O"}, {"literal":"R"}, {"literal":"D"}, {"literal":"E"}, {"literal":"R"}, {"literal":"E"}, {"literal":"D"}, {"literal":"_"}, {"literal":"L"}, {"literal":"I"}, {"literal":"S"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "OrderedList$ebnf$1$subexpression$1", "symbols": ["__", "TokenValue"]},
    {"name": "OrderedList$ebnf$1", "symbols": ["OrderedList$ebnf$1$subexpression$1"]},
    {"name": "OrderedList$ebnf$1$subexpression$2", "symbols": ["__", "TokenValue"]},
    {"name": "OrderedList$ebnf$1", "symbols": ["OrderedList$ebnf$1$subexpression$2", "OrderedList$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "OrderedList", "symbols": ["OrderedList$string$1", "OrderedList$ebnf$1"], "postprocess": 
        function(data, location, reject) {
          var children = [];
          data[1].map(function (child) {
            children.push(["li", [], [child[1]]]);
          });
          return ["ol", [], children];
        }
        },
    {"name": "Fence$string$1", "symbols": [{"literal":"F"}, {"literal":"E"}, {"literal":"N"}, {"literal":"C"}, {"literal":"E"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Fence", "symbols": ["Fence$string$1", "__", "TokenValue"], "postprocess": 
        function(data, location, reject) {
          return ["pre", [], [["code", [], [data[2].substring(3, data[2].length-3).trim()]]]];
        }
        },
    {"name": "Paragraph$ebnf$1", "symbols": []},
    {"name": "Paragraph$ebnf$1$subexpression$1", "symbols": ["ParagraphItem", "__"]},
    {"name": "Paragraph$ebnf$1", "symbols": ["Paragraph$ebnf$1$subexpression$1", "Paragraph$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "Paragraph", "symbols": ["Paragraph$ebnf$1", "ParagraphItem"], "postprocess": 
        function(data, location, reject) {
          var children = [];
          data[0].map(function (child) {
            children.push(child[0]);
          });
          children.push(data[1]);
          if (children.length === 1 && typeof children[0] !== 'string') {
            return children[0];
          } else if (children.filter(function (c) { return typeof c === 'string' }).length === 0) {
            return ["div", [], children];
          }
        
          return ["p", [], children];
        }
        },
    {"name": "ParagraphItem$subexpression$1", "symbols": ["Text"]},
    {"name": "ParagraphItem$subexpression$1", "symbols": ["ClosedComponent"]},
    {"name": "ParagraphItem$subexpression$1", "symbols": ["OpenComponent"]},
    {"name": "ParagraphItem$subexpression$1", "symbols": ["TextInline"]},
    {"name": "ParagraphItem", "symbols": ["ParagraphItem$subexpression$1"], "postprocess": 
        function(data, location, reject) {
          return data[0][0];
        }
        },
    {"name": "Text$subexpression$1$string$1", "symbols": [{"literal":"W"}, {"literal":"O"}, {"literal":"R"}, {"literal":"D"}, {"literal":"S"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Text$subexpression$1", "symbols": ["Text$subexpression$1$string$1", "__", "TokenValue"]},
    {"name": "Text", "symbols": ["Text$subexpression$1"], "postprocess": 
        function(data, location, reject) {
          return data[0][2];
        }
        },
    {"name": "TextInline$subexpression$1", "symbols": ["CodeInline"]},
    {"name": "TextInline$subexpression$1", "symbols": ["BoldInline"]},
    {"name": "TextInline$subexpression$1", "symbols": ["EmInline"]},
    {"name": "TextInline$subexpression$1", "symbols": ["LinkInline"]},
    {"name": "TextInline$subexpression$1", "symbols": ["ImageInline"]},
    {"name": "TextInline", "symbols": ["TextInline$subexpression$1"], "postprocess": 
        function(data, location, reject) {
          return data[0][0];
        }
        },
    {"name": "BoldInline$string$1", "symbols": [{"literal":"S"}, {"literal":"T"}, {"literal":"R"}, {"literal":"O"}, {"literal":"N"}, {"literal":"G"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "BoldInline", "symbols": ["BoldInline$string$1", "__", "TokenValue"], "postprocess": 
        function(data, location, reject) {
          return ['strong', [], [data[2]]];
        }
        },
    {"name": "EmInline$string$1", "symbols": [{"literal":"E"}, {"literal":"M"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "EmInline", "symbols": ["EmInline$string$1", "__", "TokenValue"], "postprocess": 
        function(data, location, reject) {
          return ['em', [], [data[2]]];
        }
        },
    {"name": "CodeInline$string$1", "symbols": [{"literal":"B"}, {"literal":"A"}, {"literal":"C"}, {"literal":"K"}, {"literal":"T"}, {"literal":"I"}, {"literal":"C"}, {"literal":"K"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "CodeInline$ebnf$1", "symbols": []},
    {"name": "CodeInline$ebnf$1$subexpression$1$subexpression$1", "symbols": ["Text"]},
    {"name": "CodeInline$ebnf$1$subexpression$1", "symbols": ["CodeInline$ebnf$1$subexpression$1$subexpression$1", "__"]},
    {"name": "CodeInline$ebnf$1", "symbols": ["CodeInline$ebnf$1$subexpression$1", "CodeInline$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "CodeInline$string$2", "symbols": [{"literal":"B"}, {"literal":"A"}, {"literal":"C"}, {"literal":"K"}, {"literal":"T"}, {"literal":"I"}, {"literal":"C"}, {"literal":"K"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "CodeInline", "symbols": ["CodeInline$string$1", "__", "CodeInline$ebnf$1", "CodeInline$string$2"], "postprocess": 
        function(data, location, reject) {
          return ['code', [], data[2].map(function (d) { return d[0][0]})];
        }
        },
    {"name": "ImageInline$string$1", "symbols": [{"literal":"I"}, {"literal":"M"}, {"literal":"A"}, {"literal":"G"}, {"literal":"E"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ImageInline", "symbols": ["ImageInline$string$1", "__", "TokenValue", "__", "TokenValue"], "postprocess": 
        function(data, location, reject) {
          return ['img', [["src", ["value", data[4]]], ["alt", ["value", data[2]]]], []];
        }
        },
    {"name": "LinkInline$string$1", "symbols": [{"literal":"L"}, {"literal":"I"}, {"literal":"N"}, {"literal":"K"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "LinkInline", "symbols": ["LinkInline$string$1", "__", "TokenValue", "__", "TokenValue"], "postprocess": 
        function(data, location, reject) {
          return ['a', [["href", ["value", data[4]]]], [data[2]]];
        }
        },
    {"name": "OpenComponent$ebnf$1", "symbols": ["Blocks"], "postprocess": id},
    {"name": "OpenComponent$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "OpenComponent", "symbols": ["OpenComponentStart", "__", "OpenComponent$ebnf$1", "OpenComponentEnd"], "postprocess": 
        function(data, location, reject) {
          return [data[0][0], data[0][1], data[2] || []];
        }
        },
    {"name": "OpenComponentStart$string$1", "symbols": [{"literal":"O"}, {"literal":"P"}, {"literal":"E"}, {"literal":"N"}, {"literal":"_"}, {"literal":"B"}, {"literal":"R"}, {"literal":"A"}, {"literal":"C"}, {"literal":"K"}, {"literal":"E"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "OpenComponentStart$string$2", "symbols": [{"literal":"C"}, {"literal":"L"}, {"literal":"O"}, {"literal":"S"}, {"literal":"E"}, {"literal":"_"}, {"literal":"B"}, {"literal":"R"}, {"literal":"A"}, {"literal":"C"}, {"literal":"K"}, {"literal":"E"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "OpenComponentStart", "symbols": ["OpenComponentStart$string$1", "__", "ComponentName", "__", "ComponentProperties", "OpenComponentStart$string$2"], "postprocess": 
        function(data, location, reject) {
          return [data[2], data[4]];
        }
        },
    {"name": "OpenComponentEnd$string$1", "symbols": [{"literal":"O"}, {"literal":"P"}, {"literal":"E"}, {"literal":"N"}, {"literal":"_"}, {"literal":"B"}, {"literal":"R"}, {"literal":"A"}, {"literal":"C"}, {"literal":"K"}, {"literal":"E"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "OpenComponentEnd$string$2", "symbols": [{"literal":"F"}, {"literal":"O"}, {"literal":"R"}, {"literal":"W"}, {"literal":"A"}, {"literal":"R"}, {"literal":"D"}, {"literal":"_"}, {"literal":"S"}, {"literal":"L"}, {"literal":"A"}, {"literal":"S"}, {"literal":"H"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "OpenComponentEnd$string$3", "symbols": [{"literal":"C"}, {"literal":"L"}, {"literal":"O"}, {"literal":"S"}, {"literal":"E"}, {"literal":"_"}, {"literal":"B"}, {"literal":"R"}, {"literal":"A"}, {"literal":"C"}, {"literal":"K"}, {"literal":"E"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "OpenComponentEnd", "symbols": ["OpenComponentEnd$string$1", "__", "OpenComponentEnd$string$2", "__", "ComponentName", "__", "OpenComponentEnd$string$3"]},
    {"name": "ClosedComponent$string$1", "symbols": [{"literal":"O"}, {"literal":"P"}, {"literal":"E"}, {"literal":"N"}, {"literal":"_"}, {"literal":"B"}, {"literal":"R"}, {"literal":"A"}, {"literal":"C"}, {"literal":"K"}, {"literal":"E"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ClosedComponent$string$2", "symbols": [{"literal":"F"}, {"literal":"O"}, {"literal":"R"}, {"literal":"W"}, {"literal":"A"}, {"literal":"R"}, {"literal":"D"}, {"literal":"_"}, {"literal":"S"}, {"literal":"L"}, {"literal":"A"}, {"literal":"S"}, {"literal":"H"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ClosedComponent$string$3", "symbols": [{"literal":"C"}, {"literal":"L"}, {"literal":"O"}, {"literal":"S"}, {"literal":"E"}, {"literal":"_"}, {"literal":"B"}, {"literal":"R"}, {"literal":"A"}, {"literal":"C"}, {"literal":"K"}, {"literal":"E"}, {"literal":"T"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ClosedComponent", "symbols": ["ClosedComponent$string$1", "__", "ComponentName", "__", "ComponentProperties", "ClosedComponent$string$2", "__", "ClosedComponent$string$3"], "postprocess": 
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
    {"name": "ComponentProperties$ebnf$1$subexpression$1", "symbols": ["ComponentProperty", "__"]},
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
    {"name": "ComponentPropertyValue$subexpression$1$string$5", "symbols": [{"literal":"B"}, {"literal":"O"}, {"literal":"O"}, {"literal":"L"}, {"literal":"E"}, {"literal":"A"}, {"literal":"N"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ComponentPropertyValue$subexpression$1", "symbols": ["ComponentPropertyValue$subexpression$1$string$5"]},
    {"name": "ComponentPropertyValue", "symbols": ["ComponentPropertyValue$subexpression$1", "__", "TokenValue"], "postprocess": 
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
