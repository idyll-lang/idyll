const { convert, inverseConvert } = require('./converters'); 
let expect = require('expect.js');
let compile = require('../../../idyll-compiler/src');
let fs = require('fs');

const example1 = {
    "id": 1, 
    "name": "root", 
    "type": "component", 
    "value": "value",
    "children": [
        {
            "id": 2, 
            "name": "TextConatiner", 
            "type": "component", 
            "children": [
                {
                    "id": 3,
                    "name": "p",
                    "type": "component", 
                    "children": [
                        {
                            "id": 4, 
                            "type": "textnode", 
                            "value": "This is the first paragraphs's text!"
                        }
                    ]

                }
            ]
        }, 
        {
            "id": 5, 
            "name": "TextConatiner",
            "type": "component",
            "children": [
                {
                    "id": 6,
                    "name": "p",
                    "type": "component",
                    "children": [
                        {   
                            "id": 7,
                            "type": "component",
                            "name": "a",
                            "properties": {
                                "href": {
                                    "type": "value", 
                                    "value": "https://www.example.com"
                                }, 
                                "hr": {
                                    "type": "value", 
                                    "value": "asdfadsf"
                                }
                            },
                            "children" : [
                                {   
                                    "id": 8, 
                                    "type": "component", 
                                    "name": "img", 
                                    "properties": {
                                        "src": {
                                            "type": "value", 
                                            "value": "src/image"
                                        }
                                    }
                                }
                            ] 
                        }
                    ] 

                }
            ]
        }
    ]
}; 

const example1Array = [["TextConatiner",[],[["p",[],["This is the first paragraphs's text!"]]]],["TextConatiner",[],[["p",[],[["a",[["href",["value","https://www.example.com"]], ["hr",["value","https://www.mple.com"]]],[["img",[["src",["value","https://www.example.com/example-img.jpg"]]]]]]]]]]]; 
function testConverter() {
    console.log(JSON.stringify(convert(example1)));    
}

function testInverseConverter() {
    console.log(JSON.stringify(inverseConvert(example1Array)));  
}
/*
function test1() {
    let input = `
    ## This is a header
    And this is a normal paragraph. This is # not a header.

    [component]# This header is inside a component.[/component]

    [component]This is not a # header inside a component.[/component]

    [component /]

    # Header

    End text
  `;
  let value = compile(input, {async: false}); 
  console.log(JSON.stringify(value))
  console.log(JSON.stringify((convert(inverseConvert(value))))); 
}

//test1();

*/
testConverter(); 