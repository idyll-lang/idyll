# react-latex [![NPM version][npm-image]][npm-url][![Dependency Status][daviddm-image]][daviddm-url][![Build Status][travis-image]][travis-url]

> React component to render latex strings, based on [Katex](https://github.com/Khan/KaTeX)


## Install

```sh
$ npm install --save react-latex
```


## Usage

In javascript
```js
var Latex = require('react-latex');

...
    render(){
        return (
            <h3>
                <Latex>What is $(3\times 4) \div (5-3)$</Latex>
            </h3>
        );
    }
...
```

Include in your html Katex CSS

```html

<html>
    <head>
        <link href="//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.3.0/katex.min.css" rel="stylesheet">
    </head>
</html>

```

## License

MIT © [Zzish](http://www.zzish.com)


[npm-image]: https://badge.fury.io/js/react-latex.svg
[npm-url]: https://npmjs.org/package/react-latex
[travis-image]: https://travis-ci.org/zzish/react-latex.svg?branch=master
[travis-url]: https://travis-ci.org/zzish/react-latex
[daviddm-image]: https://david-dm.org/zzish/react-latex.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/zzish/react-latex
