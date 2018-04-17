# idyll-compiler
Lexer and parser for Idyll lang. If you want to embed Idyll on your webpage, use the `idyll-document` package.


## Installation

```
$ npm install --save idyll-compiler
```

## Usage

```javascript
import compile from 'idyll-compiler';

compile(inputString, options)
  .then((ast) => {
    // Do something with the generated abstract syntax tree.
  })
```

## Developing

1. Clone this repo
2. Bootstrap with lerna: `lerna bootstrap` (run from the top level folder)
3. Make your changes
4. Run the tests: `lerna run test`

If you want to make a change, add a failing test,
update the compiler so that the test passes, then
submit a PR.
