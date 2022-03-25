const astTestVar = () => ({
  type: 'component',
  name: 'root',
  children: [
    {
      type: 'component',
      name: 'textContainer',
      children: [
        {
          type: 'component',
          name: 'p',
          children: [
            {
              type: 'textnode',
              value: 'This is the first paragraph'
            }
          ]
        },
        {
          type: 'component',
          name: 'div',
          children: [
            {
              type: 'component',
              name: 'h1',
              children: [
                {
                  type: 'textnode',
                  value: 'This is a header'
                }
              ]
            },
            {
              type: 'var',
              properties: {
                name: {
                  type: 'value',
                  value: 'testVar'
                },
                value: {
                  type: 'expression',
                  value: '3 * 3'
                }
              }
            },
            {
              type: 'component',
              name: 'p',
              children: [
                {
                  type: 'component',
                  name: 'a',
                  properties: {
                    href: {
                      type: 'value',
                      value: 'www.test.com'
                    }
                  },
                  children: [
                    {
                      type: 'textnode',
                      value: 'This is a link to a website'
                    }
                  ]
                },
                {
                  type: 'data',
                  properties: {
                    name: {
                      type: 'value',
                      value: 'testData'
                    },
                    source: {
                      type: 'value',
                      value: 'test.csv'
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
});

const astTestMeta = () => ({
  type: 'component',
  name: 'root',
  children: [
    {
      type: 'component',
      name: 'textContainer',
      children: [
        {
          type: 'component',
          name: 'p',
          children: [
            {
              type: 'textnode',
              value: 'This is the first paragraph'
            }
          ]
        },
        {
          type: 'component',
          name: 'div',
          children: [
            {
              type: 'component',
              name: 'h1',
              children: [
                {
                  type: 'textnode',
                  value: 'This is a header'
                }
              ]
            },
            {
              type: 'var',
              properties: {
                name: {
                  type: 'value',
                  value: 'testVar'
                },
                value: {
                  type: 'expression',
                  value: '3 * 3'
                }
              }
            },
            {
              type: 'component',
              name: 'p',
              children: [
                {
                  type: 'component',
                  name: 'a',
                  properties: {
                    href: {
                      type: 'value',
                      value: 'www.test.com'
                    }
                  },
                  children: [
                    {
                      type: 'textnode',
                      value: 'This is a link to a website'
                    }
                  ]
                },
                {
                  type: 'data',
                  properties: {
                    name: {
                      type: 'value',
                      value: 'testData'
                    },
                    source: {
                      type: 'value',
                      value: 'test.csv'
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
      type: 'component',
      name: 'meta',
      properties: {
        title: {
          type: 'value',
          value: 'Test'
        },
        description: {
          type: 'value',
          value: 'Short description of your project'
        }
      },
      children: []
    }
  ]
});

const updatedASTWithNode = () => ({
  type: 'component',
  name: 'root',
  children: [
    {
      type: 'component',
      name: 'textContainer',
      children: [
        {
          type: 'component',
          name: 'p',
          children: [
            {
              type: 'textnode',
              value: 'This is the first paragraph'
            }
          ]
        },
        {
          type: 'component',
          name: 'div',
          children: [
            {
              type: 'component',
              name: 'h1',
              children: [
                {
                  type: 'textnode',
                  value: 'This is a header'
                }
              ]
            },
            {
              type: 'var',
              properties: {
                name: {
                  type: 'value',
                  value: 'testVar'
                },
                value: {
                  type: 'expression',
                  value: '3 * 3'
                }
              }
            },
            {
              type: 'component',
              name: 'p',
              children: [
                {
                  type: 'component',
                  name: 'a',
                  properties: {
                    href: {
                      type: 'value',
                      value: 'www.test.com'
                    }
                  },
                  children: [
                    {
                      type: 'textnode',
                      value: 'This is a link to a website'
                    }
                  ]
                },
                {
                  type: 'data',
                  properties: {
                    name: {
                      type: 'value',
                      value: 'testData'
                    },
                    source: {
                      type: 'value',
                      value: 'test.csv'
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
      type: 'component',
      name: 'p',
      children: [
        {
          type: 'textnode',
          value: 'This is a new node'
        }
      ]
    }
  ]
});

const updatedASTWithNodes = () => ({
  type: 'component',
  name: 'root',
  children: [
    {
      type: 'component',
      name: 'textContainer',
      children: [
        {
          type: 'component',
          name: 'p',
          children: [
            {
              type: 'textnode',
              value: 'This is the first paragraph'
            }
          ]
        },
        {
          type: 'component',
          name: 'div',
          children: [
            {
              type: 'component',
              name: 'h1',
              children: [
                {
                  type: 'textnode',
                  value: 'This is a header'
                }
              ]
            },
            {
              type: 'var',
              properties: {
                name: {
                  type: 'value',
                  value: 'testVar'
                },
                value: {
                  type: 'expression',
                  value: '3 * 3'
                }
              }
            },
            {
              type: 'component',
              name: 'p',
              children: [
                {
                  type: 'component',
                  name: 'a',
                  properties: {
                    href: {
                      type: 'value',
                      value: 'www.test.com'
                    }
                  },
                  children: [
                    {
                      type: 'textnode',
                      value: 'This is a link to a website'
                    }
                  ]
                },
                {
                  type: 'data',
                  properties: {
                    name: {
                      type: 'value',
                      value: 'testData'
                    },
                    source: {
                      type: 'value',
                      value: 'test.csv'
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
      type: 'component',
      name: 'p',
      children: [
        {
          type: 'textnode',
          value: 'This is a new node'
        }
      ]
    },
    {
      type: 'component',
      name: 'p',
      children: [
        {
          type: 'textnode',
          value: 'This is a new node'
        }
      ]
    }
  ]
});

const testChildren = () => [
  {
    type: 'component',
    name: 'textContainer',
    children: [
      {
        type: 'component',
        name: 'p',
        children: [
          {
            type: 'textnode',
            value: 'This is the first paragraph'
          }
        ]
      },
      {
        type: 'component',
        name: 'div',
        children: [
          {
            type: 'component',
            name: 'h1',
            children: [
              {
                type: 'textnode',
                value: 'This is a header'
              }
            ]
          },
          {
            type: 'var',
            properties: {
              name: {
                type: 'value',
                value: 'testVar'
              },
              value: {
                type: 'expression',
                value: '3 * 3'
              }
            }
          },
          {
            type: 'component',
            name: 'p',
            children: [
              {
                type: 'component',
                name: 'a',
                properties: {
                  href: {
                    type: 'value',
                    value: 'www.test.com'
                  }
                },
                children: [
                  {
                    type: 'textnode',
                    value: 'This is a link to a website'
                  }
                ]
              },
              {
                type: 'data',
                properties: {
                  name: {
                    type: 'value',
                    value: 'testData'
                  },
                  source: {
                    type: 'value',
                    value: 'test.csv'
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
    type: 'component',
    name: 'p',
    children: [
      {
        type: 'textnode',
        value: 'This is a new node'
      }
    ]
  }
];

const nodesWithChildren = () => ({
  type: 'component',
  name: 'root',
  children: [
    {
      type: 'component',
      name: 'textContainer',
      children: [
        {
          type: 'component',
          name: 'p',
          children: [
            {
              type: 'textnode',
              value: 'This is the first paragraph'
            }
          ]
        },
        {
          type: 'component',
          name: 'div',
          children: [
            {
              type: 'component',
              name: 'h1',
              children: [
                {
                  type: 'textnode',
                  value: 'This is a header'
                }
              ]
            },
            {
              type: 'var',
              properties: {
                name: {
                  type: 'value',
                  value: 'testVar'
                },
                value: {
                  type: 'expression',
                  value: '3 * 3'
                }
              }
            },
            {
              type: 'component',
              name: 'p',
              children: [
                {
                  type: 'component',
                  name: 'a',
                  properties: {
                    href: {
                      type: 'value',
                      value: 'www.test.com'
                    }
                  },
                  children: [
                    {
                      type: 'textnode',
                      value: 'This is a link to a website'
                    }
                  ]
                },
                {
                  type: 'data',
                  properties: {
                    name: {
                      type: 'value',
                      value: 'testData'
                    },
                    source: {
                      type: 'value',
                      value: 'test.csv'
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
});

const modifiedNode = () => ({
  type: 'component',
  name: 'root',
  children: [
    {
      type: 'component',
      name: 'p',
      children: [
        {
          type: 'textnode',
          value: 'This is a new node'
        }
      ]
    },
    {
      type: 'component',
      name: 'p',
      children: [
        {
          type: 'textnode',
          value: 'This is a new node'
        }
      ]
    }
  ]
});

const paraNode = () => ({
  type: 'component',
  name: 'root',
  children: [
    {
      type: 'component',
      name: 'textContainer',
      children: [
        {
          type: 'component',
          name: 'paragraph',
          children: [
            {
              type: 'textnode',
              value: 'This is the first paragraph'
            }
          ]
        },
        {
          type: 'component',
          name: 'div',
          children: [
            {
              type: 'component',
              name: 'h1',
              children: [
                {
                  type: 'textnode',
                  value: 'This is a header'
                }
              ]
            },
            {
              type: 'var',
              properties: {
                name: {
                  type: 'value',
                  value: 'testVar'
                },
                value: {
                  type: 'expression',
                  value: '3 * 3'
                }
              }
            },
            {
              type: 'component',
              name: 'paragraph',
              children: [
                {
                  type: 'component',
                  name: 'a',
                  properties: {
                    href: {
                      type: 'value',
                      value: 'www.test.com'
                    }
                  },
                  children: [
                    {
                      type: 'textnode',
                      value: 'This is a link to a website'
                    }
                  ]
                },
                {
                  type: 'data',
                  properties: {
                    name: {
                      type: 'value',
                      value: 'testData'
                    },
                    source: {
                      type: 'value',
                      value: 'test.csv'
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
});

const createComponent = function() {
  return {
    type: 'component',
    name: 'p',
    children: [
      {
        type: 'textnode',
        value: 'This is a new node'
      }
    ]
  };
};

const createAnchorNode = function() {
  return {
    type: 'component',
    name: 'a',
    properties: {
      href: {
        type: 'value',
        value: 'www.example.com'
      }
    },
    children: [
      {
        type: 'textnode',
        value: 'Link to a website'
      }
    ]
  };
};

const createExampleTextNode = function() {
  return {
    type: 'textnode',
    value: 'This is an example textnode'
  };
};

const createExampleVarNode = function() {
  return {
    type: 'var',
    properties: {
      name: {
        type: 'value',
        value: 'myVar'
      },
      value: {
        type: 'value',
        value: 'abc'
      }
    }
  };
};

const createExampleData = function() {
  return {
    type: 'data',
    properties: {
      name: {
        type: 'value',
        value: 'mydata'
      },
      source: {
        type: 'value',
        value: 'abc'
      }
    }
  };
};

module.exports = {
  astTestVar,
  astTestMeta,
  updatedASTWithNode,
  updatedASTWithNodes,
  testChildren,
  createComponent,
  createAnchorNode,
  createExampleData,
  createExampleTextNode,
  createExampleVarNode,
  modifiedNode,
  paraNode
};
