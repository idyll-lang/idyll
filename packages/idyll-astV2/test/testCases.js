const astTestVar = {
    "id": 0,
    "type": "component",
    "name": "root",
    "children": [{
        "id": 1,
        "type": "component",
        "name": "textContainer",
        "children": [{
                "id": 2,
                "type": "component",
                "name": "p",
                "children": [{
                    "id": 3,
                    "type": "textnode",
                    "value": "This is the first paragraph"
                }]
            },
            {
                "id": 3,
                "type": "component",
                "name": "div",
                "children": [{
                        "id": 4,
                        "type": "component",
                        "name": "h1",
                        "children": [{
                            "id": 5,
                            "type": "textnode",
                            "value": "This is a header"
                        }]
                    },
                    {
                        "id": 6,
                        "type": "var",
                        "properties": {
                            "name": {
                                "type": "value",
                                "value": "testVar"
                            },
                            "value": {
                                "type": "expression",
                                "value": "3 * 3"
                            }
                        }
                    },
                    {
                        "id": 7,
                        "type": "component",
                        "name": "p",
                        "children": [{
                                "id": 8,
                                "type": "component",
                                "name": "a",
                                "properties": {
                                    "href": {
                                        "type": "value",
                                        "value": "www.test.com"
                                    }
                                },
                                "children": [{
                                    "id": 9,
                                    "type": "textnode",
                                    "value": "This is a link to a website"
                                }]
                            },
                            {
                                "id": 10,
                                "type": "data",
                                "properties": {
                                    "name": {
                                        "type": "value",
                                        "value": "testData"
                                    },
                                    "source": {
                                        "type": "value",
                                        "value": "test.csv"
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }]
};

const updatedASTWithNode = {
    "id": 0,
    "type": "component",
    "name": "root",
    "children": [{
            "id": 1,
            "type": "component",
            "name": "textContainer",
            "children": [{
                    "id": 2,
                    "type": "component",
                    "name": "p",
                    "children": [{
                        "id": 3,
                        "type": "textnode",
                        "value": "This is the first paragraph"
                    }]
                },
                {
                    "id": 3,
                    "type": "component",
                    "name": "div",
                    "children": [{
                            "id": 4,
                            "type": "component",
                            "name": "h1",
                            "children": [{
                                "id": 5,
                                "type": "textnode",
                                "value": "This is a header"
                            }]
                        },
                        {
                            "id": 6,
                            "type": "var",
                            "properties": {
                                "name": {
                                    "type": "value",
                                    "value": "testVar"
                                },
                                "value": {
                                    "type": "expression",
                                    "value": "3 * 3"
                                }
                            }
                        },
                        {
                            "id": 7,
                            "type": "component",
                            "name": "p",
                            "children": [{
                                    "id": 8,
                                    "type": "component",
                                    "name": "a",
                                    "properties": {
                                        "href": {
                                            "type": "value",
                                            "value": "www.test.com"
                                        }
                                    },
                                    "children": [{
                                        "id": 9,
                                        "type": "textnode",
                                        "value": "This is a link to a website"
                                    }]
                                },
                                {
                                    "id": 10,
                                    "type": "data",
                                    "properties": {
                                        "name": {
                                            "type": "value",
                                            "value": "testData"
                                        },
                                        "source": {
                                            "type": "value",
                                            "value": "test.csv"
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": 11,
            "type": "component",
            "name": "p",
            "children": [{
                "id": 12,
                "type": "textnode",
                "value": "This is a new node"
            }]
        }
    ]
};

const updatedASTWithNodes = {
    "id": 0,
    "type": "component",
    "name": "root",
    "children": [{
            "id": 1,
            "type": "component",
            "name": "textContainer",
            "children": [{
                    "id": 2,
                    "type": "component",
                    "name": "p",
                    "children": [{
                        "id": 3,
                        "type": "textnode",
                        "value": "This is the first paragraph"
                    }]
                },
                {
                    "id": 3,
                    "type": "component",
                    "name": "div",
                    "children": [{
                            "id": 4,
                            "type": "component",
                            "name": "h1",
                            "children": [{
                                "id": 5,
                                "type": "textnode",
                                "value": "This is a header"
                            }]
                        },
                        {
                            "id": 6,
                            "type": "var",
                            "properties": {
                                "name": {
                                    "type": "value",
                                    "value": "testVar"
                                },
                                "value": {
                                    "type": "expression",
                                    "value": "3 * 3"
                                }
                            }
                        },
                        {
                            "id": 7,
                            "type": "component",
                            "name": "p",
                            "children": [{
                                    "id": 8,
                                    "type": "component",
                                    "name": "a",
                                    "properties": {
                                        "href": {
                                            "type": "value",
                                            "value": "www.test.com"
                                        }
                                    },
                                    "children": [{
                                        "id": 9,
                                        "type": "textnode",
                                        "value": "This is a link to a website"
                                    }]
                                },
                                {
                                    "id": 10,
                                    "type": "data",
                                    "properties": {
                                        "name": {
                                            "type": "value",
                                            "value": "testData"
                                        },
                                        "source": {
                                            "type": "value",
                                            "value": "test.csv"
                                        }
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "id": 11,
            "type": "component",
            "name": "p",
            "children": [{
                "id": 12,
                "type": "textnode",
                "value": "This is a new node"
            }]
        },
        {
            "id": 13,
            "type": "component",
            "name": "p",
            "children": [{
                "id": 14,
                "type": "textnode",
                "value": "This is a new node"
            }]
        }
    ]
};

const testChildren = [{
        "id": 1,
        "type": "component",
        "name": "textContainer",
        "children": [{
                "id": 2,
                "type": "component",
                "name": "p",
                "children": [{
                    "id": 3,
                    "type": "textnode",
                    "value": "This is the first paragraph"
                }]
            },
            {
                "id": 3,
                "type": "component",
                "name": "div",
                "children": [{
                        "id": 4,
                        "type": "component",
                        "name": "h1",
                        "children": [{
                            "id": 5,
                            "type": "textnode",
                            "value": "This is a header"
                        }]
                    },
                    {
                        "id": 6,
                        "type": "var",
                        "properties": {
                            "name": {
                                "type": "value",
                                "value": "testVar"
                            },
                            "value": {
                                "type": "expression",
                                "value": "3 * 3"
                            }
                        }
                    },
                    {
                        "id": 7,
                        "type": "component",
                        "name": "p",
                        "children": [{
                                "id": 8,
                                "type": "component",
                                "name": "a",
                                "properties": {
                                    "href": {
                                        "type": "value",
                                        "value": "www.test.com"
                                    }
                                },
                                "children": [{
                                    "id": 9,
                                    "type": "textnode",
                                    "value": "This is a link to a website"
                                }]
                            },
                            {
                                "id": 10,
                                "type": "data",
                                "properties": {
                                    "name": {
                                        "type": "value",
                                        "value": "testData"
                                    },
                                    "source": {
                                        "type": "value",
                                        "value": "test.csv"
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "id": 11,
        "type": "component",
        "name": "p",
        "children": [{
            "id": 12,
            "type": "textnode",
            "value": "This is a new node"
        }]
    }
];

const nodesWithChildren = {
    "id": 0,
    "type": "component",
    "name": "root",
    "children": [{
        "id": 1,
        "type": "component",
        "name": "textContainer",
        "children": [{
                "id": 2,
                "type": "component",
                "name": "p",
                "children": [{
                    "id": 3,
                    "type": "textnode",
                    "value": "This is the first paragraph"
                }]
            },
            {
                "id": 3,
                "type": "component",
                "name": "div",
                "children": [{
                        "id": 4,
                        "type": "component",
                        "name": "h1",
                        "children": [{
                            "id": 5,
                            "type": "textnode",
                            "value": "This is a header"
                        }]
                    },
                    {
                        "id": 6,
                        "type": "var",
                        "properties": {
                            "name": {
                                "type": "value",
                                "value": "testVar"
                            },
                            "value": {
                                "type": "expression",
                                "value": "3 * 3"
                            }
                        }
                    },
                    {
                        "id": 7,
                        "type": "component",
                        "name": "p",
                        "children": [{
                                "id": 8,
                                "type": "component",
                                "name": "a",
                                "properties": {
                                    "href": {
                                        "type": "value",
                                        "value": "www.test.com"
                                    }
                                },
                                "children": [{
                                    "id": 9,
                                    "type": "textnode",
                                    "value": "This is a link to a website"
                                }]
                            },
                            {
                                "id": 10,
                                "type": "data",
                                "properties": {
                                    "name": {
                                        "type": "value",
                                        "value": "testData"
                                    },
                                    "source": {
                                        "type": "value",
                                        "value": "test.csv"
                                    }
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    }]
};
const createComponent = function (id) {
    return {
        "id": id++,
        "type": "component",
        "name": "p",
        "children": [{
            "id": id,
            "type": "textnode",
            "value": "This is a new node"
        }]
    };
}

const createAnchorNode = function (id) {
    return {
        "id": id++,
        "type": "component",
        "name": "a",
        "properties": {
            "href": {
                "type": "value",
                "value": "www.example.com"
            }
        },
        "children": [{
            "id": id,
            "type": "textnode",
            "value": "Link to a website"
        }]
    };
}

const createExampleTextNode = function (id) {
    return {
        "id": id,
        "type": "textnode",
        "value": "This is an example textnode"
    };
}

const createExampleVarNode = function (id) {
    return {
        "id": id,
        "type": "var",
        "properties": {
            "name": {
                "type": "value",
                "value": "myVar"
            },
            "value": {
                "type": "value",
                "value": "abc"
            }
        }
    };
}

const createExampleData = function (id) {
    return {
        "id": id,
        "type": "data",
        "properties": {
            "name": {
                "type": "value",
                "value": "mydata"
            },
            "source": {
                "type": "value",
                "value": "abc"
            }
        }
    };
}


module.exports = {
    astTestVar,
    updatedASTWithNode,
    updatedASTWithNodes,
    testChildren, 
    createComponent,
    createAnchorNode,
    createExampleData,
    createExampleTextNode,
    createExampleVarNode
};