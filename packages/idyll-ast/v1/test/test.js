var expect = require('expect.js');
var ast = require('../src');

describe('sanity check', function() {
  it('should not blow up', function() {
    const input = [['div', [], []]];
    expect(ast.getNodesByName(input, 'div')).to.eql([['div', [], []]]);
  });
});

describe('getText', function() {
  it('getText returns text of node', function() {
    const input = [
      [
        'var',
        [
          ['name', ['value', 'selectedDecade']],
          ['value', ['expression', ' null ']]
        ],
        []
      ],
      [
        'var',
        [['name', ['value', 'stepperIndex']], ['value', ['value', 0]]],
        []
      ],
      [
        'var',
        [
          ['name', ['value', 'firstStepperState']],
          ['value', ['expression', ' null ']]
        ],
        []
      ],
      [
        'var',
        [['name', ['value', 'markColor']], ['value', ['value', '#000']]],
        []
      ],
      [
        'var',
        [['name', ['value', 'focus']], ['value', ['expression', ' null ']]],
        []
      ],
      [
        'var',
        [
          ['name', ['value', 'url']],
          ['value', ['value', 'https://jsonplaceholder.typicode.com/todos/1']]
        ],
        []
      ],
      [
        'var',
        [
          ['name', ['value', 'urlResults']],
          ['value', ['expression', ' null ']]
        ],
        []
      ],
      [
        'var',
        [['name', ['value', 'isLoaded']], ['value', ['value', false]]],
        []
      ],
      [
        'var',
        [['name', ['value', 'showHero']], ['value', ['value', true]]],
        []
      ],
      [
        'data',
        [['name', ['value', 'tourDates']], ['source', ['value', 'fugazi.csv']]],
        []
      ],
      [
        'derived',
        [
          ['name', ['value', 'showCount']],
          ['value', ['expression', 'tourDates.length ']]
        ],
        []
      ],
      [
        'derived',
        [
          ['name', ['value', 'showsPerYear']],
          [
            'value',
            [
              'expression',
              'tourDates.reduce((memo, d) => {\n  if (memo[d.year]) {\n    memo[d.year] += 1;\n  } else {\n    memo[d.year] = 1;\n  }\n  return memo;\n}, {})  '
            ]
          ]
        ],
        []
      ],
      [
        'derived',
        [
          ['name', ['value', 'avgShowsPerYear']],
          [
            'value',
            [
              'expression',
              'Object.keys(showsPerYear).reduce((memo, y) => memo + showsPerYear[y], 0) / Object.keys(showsPerYear).length; '
            ]
          ]
        ],
        []
      ],
      [
        'derived',
        [
          ['name', ['value', 'vegaTheme']],
          [
            'value',
            [
              'expression',
              "{  group: {\n    fill: '#e5e5e5',\n  },\n\n  arc: { fill: markColor },\n  area: { fill: markColor },\n  line: { stroke: markColor },\n  path: { stroke: markColor },\n  rect: { fill: markColor },\n  shape: { stroke: markColor },\n  symbol: { fill: markColor, size: 40 },\n\n  axis: {\n    domain: false,\n    grid: true,\n    gridColor: '#FFFFFF',\n    gridOpacity: 1,\n    labelColor: '#7F7F7F',\n    labelPadding: 4,\n    tickColor: '#7F7F7F',\n    tickSize: 5.67,\n    titleFontSize: 16,\n    titleFontWeight: 'normal',\n  },\n\n  legend: {\n    labelBaseline: 'middle',\n    labelFontSize: 11,\n    symbolSize: 40,\n  },\n\n  range: {\n    category: [\n      '#000000',\n      '#7F7F7F',\n      '#1A1A1A',\n      '#999999',\n      '#333333',\n      '#B0B0B0',\n      '#4D4D4D',\n      '#C9C9C9',\n      '#666666',\n      '#DCDCDC',\n    ],\n  },\n}"
            ]
          ]
        ],
        []
      ],
      [
        'derived',
        [
          ['name', ['value', 'stepperState']],
          [
            'value',
            [
              'expression',
              "['hero', 'hero', 'map','map', 'map', 'map', 'drums'][stepperIndex]"
            ]
          ]
        ],
        []
      ],
      [
        'derived',
        [
          ['name', ['value', 'stepFocus']],
          [
            'value',
            [
              'expression',
              "[null, 'all', 'all', 'north-america', 'north-america', 'europe', null][stepperIndex]"
            ]
          ]
        ],
        []
      ],
      [
        'derived',
        [
          ['name', ['value', 'urlWatcher']],
          [
            'value',
            [
              'expression',
              'fetch(url).then((results) => {\n  urlResults = results;\n}) '
            ]
          ]
        ],
        []
      ],
      [
        'TextContainer',
        [],
        [
          [
            'meta',
            [
              ['title', ['value', 'Fugazi Idyll']],
              ['description', ['value', 'Short description of your project']]
            ],
            []
          ],
          ['ScrollLock', [['locked', ['expression', ' !isLoaded ']]], []]
        ]
      ],
      [
        'div',
        [
          [
            'style',
            [
              'expression',
              "{\n  width: '100vw',\n  height: '100vh',\n  position: 'fixed',\n  transition: 'opacity 1s',\n  opacity: stepperState === 'hero' ? 1 : 0,\n  background: 'url(static/images/hero.jpg) no-repeat center center fixed',\n}"
            ]
          ]
        ],
        []
      ],
      [
        'Scroller',
        [['currentState', ['variable', 'firstStepperState']]],
        [
          [
            'Step',
            [],
            [
              [
                'Header',
                [
                  ['title', ['value', 'The DIY Data of Fugazi']],
                  ['author', ['value', 'Matthew Conlen']],
                  ['authorLink', ['value', 'https://twitter.com/mathisonian']]
                ],
                []
              ],
              [
                'Conditional',
                [['if', ['expression', '!isLoaded ']]],
                [
                  [
                    'div',
                    [
                      [
                        'style',
                        ['expression', "{textAlign: 'left', width: '100%'}"]
                      ]
                    ],
                    ['\n        Loading...\n      ']
                  ]
                ]
              ],
              [
                'Conditional',
                [['if', ['expression', 'isLoaded ']]],
                [
                  [
                    'p',
                    [],
                    [
                      'Fugazi played ',
                      [
                        'Display',
                        [
                          ['value', ['variable', 'showCount']],
                          ['format', ['value', 'd']]
                        ],
                        []
                      ],
                      ' shows\n    from 1987 to 2002.    Fugazi played ',
                      [
                        'Display',
                        [
                          ['value', ['variable', 'showCount']],
                          ['format', ['value', 'd']]
                        ],
                        []
                      ],
                      ' shows\n    from 1987 to 2002.    Fugazi played ',
                      [
                        'Display',
                        [
                          ['value', ['variable', 'showCount']],
                          ['format', ['value', 'd']]
                        ],
                        []
                      ],
                      ' shows\n    from 1987 to 2002.'
                    ]
                  ],
                  [
                    'p',
                    [],
                    [
                      'They played an average of ',
                      [
                        'Display',
                        [
                          [
                            'value',
                            [
                              'expression',
                              'Object.keys(showsPerYear).reduce((memo, y) => memo + showsPerYear[y], 0) / Object.keys(showsPerYear).length;'
                            ]
                          ],
                          ['format', ['value', 'd']]
                        ],
                        []
                      ],
                      '  shows over that\n    ',
                      [
                        'Display',
                        [
                          [
                            'value',
                            ['expression', 'Object.keys(showsPerYear).length']
                          ],
                          ['format', ['value', 'd']]
                        ],
                        []
                      ],
                      ' year period. They played an average of ',
                      [
                        'Display',
                        [
                          [
                            'value',
                            [
                              'expression',
                              'Object.keys(showsPerYear).reduce((memo, y) => memo + showsPerYear[y], 0) / Object.keys(showsPerYear).length;'
                            ]
                          ],
                          ['format', ['value', 'd']]
                        ],
                        []
                      ],
                      '  shows over that\n    ',
                      [
                        'Display',
                        [
                          [
                            'value',
                            ['expression', 'Object.keys(showsPerYear).length']
                          ],
                          ['format', ['value', 'd']]
                        ],
                        []
                      ],
                      ' year period.'
                    ]
                  ]
                ]
              ]
            ]
          ],
          [
            'Step',
            [],
            [
              [
                'div',
                [
                  [
                    'style',
                    [
                      'expression',
                      " { padding: 20, background: 'black', margin: '0 auto', textAlign: 'center' } "
                    ]
                  ]
                ],
                [
                  [
                    'VL',
                    [
                      ['data', ['variable', 'tourDates']],
                      [
                        'spec',
                        [
                          'expression',
                          '{\n       "mark": "bar",\n        "encoding": {\n          "x": {"field": "year", "type": "temporal", "axis": {"format": "%Y"}},\n          "y": {"aggregate": "count", "field": "year", "type": "quantitative"}\n        },\n        "config": vegaTheme\n    }'
                        ]
                      ]
                    ],
                    []
                  ]
                ]
              ]
            ]
          ]
        ]
      ],
      [
        'Scroller',
        [['currentStep', ['variable', 'stepperIndex']]],
        [
          [
            'Graphic',
            [],
            [
              [
                'TourMap',
                [
                  ['isLoaded', ['variable', 'isLoaded']],
                  ['data', ['variable', 'tourDates']],
                  ['selectedDecade', ['variable', 'selectedDecade']],
                  ['stepFocus', ['variable', 'stepFocus']],
                  ['stepperIndex', ['variable', 'stepperIndex']],
                  ['focus', ['variable', 'focus']]
                ],
                []
              ]
            ]
          ],
          [
            'Step',
            [],
            [
              [
                'p',
                [],
                [
                  '\n    Fugazi played ',
                  [
                    'Display',
                    [
                      ['value', ['variable', 'showCount']],
                      ['format', ['value', 'd']]
                    ],
                    []
                  ],
                  ' shows\n    from 1987 to 2002.'
                ]
              ],
              [
                'p',
                [],
                [
                  'They played an average of ',
                  [
                    'Display',
                    [
                      [
                        'value',
                        [
                          'expression',
                          'Object.keys(showsPerYear).reduce((memo, y) => memo + showsPerYear[y], 0) / Object.keys(showsPerYear).length;'
                        ]
                      ],
                      ['format', ['value', 'd']]
                    ],
                    []
                  ],
                  '  shows over that\n    ',
                  [
                    'Display',
                    [
                      [
                        'value',
                        ['expression', 'Object.keys(showsPerYear).length']
                      ],
                      ['format', ['value', 'd']]
                    ],
                    []
                  ],
                  ' year period.'
                ]
              ]
            ]
          ],
          [
            'Step',
            [],
            [
              [
                'VL',
                [
                  ['data', ['variable', 'tourDates']],
                  [
                    'spec',
                    [
                      'expression',
                      '{\n       "mark": "bar",\n        "encoding": {\n          "x": {"field": "year", "type": "temporal", "axis": {"format": "%Y"}},\n          "y": {"aggregate": "count", "field": "year", "type": "quantitative"}\n        },\n        "config": vegaTheme\n    }'
                    ]
                  ]
                ],
                []
              ]
            ]
          ],
          [
            'Step',
            [],
            [
              ['h1', [], ['Select a decade:']],
              [
                'Button',
                [['onClick', ['expression', " selectedDecade = '198' "]]],
                ["1980's\n    "]
              ],
              [
                'Button',
                [['onClick', ['expression', " selectedDecade = '199' "]]],
                ["1990's\n    "]
              ],
              [
                'Button',
                [['onClick', ['expression', " selectedDecade = '200' "]]],
                ["2000's\n    "]
              ],
              [
                'Button',
                [['onClick', ['expression', ' selectedDecade = null ']]],
                ['\n      All\n    ']
              ]
            ]
          ],
          [
            'Step',
            [],
            [
              ['h1', [], ['Select a location:']],
              [
                'Button',
                [['onClick', ['expression', " focus = 'north-america' "]]],
                ['\n      North America\n    ']
              ],
              [
                'Button',
                [['onClick', ['expression', " focus = 'europe' "]]],
                ['\n      Europe\n    ']
              ],
              [
                'Button',
                [['onClick', ['expression', ' focus = null ']]],
                ['\n      All\n    ']
              ]
            ]
          ],
          [
            'Step',
            [],
            [
              [
                'iframe',
                [
                  ['width', ['value', 560]],
                  ['height', ['value', 315]],
                  [
                    'src',
                    ['value', 'https://www.youtube.com/embed/gzC0RNkBXM0']
                  ],
                  ['allow', ['value', 'autoplay; encrypted-media']],
                  ['frameBorder', ['value', 0]],
                  ['allowFullScreen', ['value', true]]
                ],
                []
              ]
            ]
          ]
        ]
      ],
      [
        'TextContainer',
        [],
        [
          [
            'fixed',
            [],
            [
              ['display', [['value', ['variable', 'stepperIndex']]], []],
              ['display', [['value', ['variable', 'urlResults']]], []]
            ]
          ]
        ]
      ]
    ];
    console.log(ast.getText(input));
  });
});

//TODO:
//modifyNodesbyName, getChildren, walkNodes, prependNodes, setProperties, removeProperty, removeNodesbyName
