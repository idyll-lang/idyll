ap
==

`Function.prototype.bind` sets `this` which is super annoying if you just want
to do currying over arguments while passing `this` through.

Instead you can do:

``` js
var ap = require('ap');
var z = ap([3], function (x, y) {
    return this.z * (x * 2 + y);
}).call({ z : 10 }, 4);
console.log(z);
```

***

```
100
```

methods
=======

``` js
var ap = require('ap')
```

## ap(args, fn)

Fill in the arguments `args` at the beginning of `fn`'s arguments list.

## ap.pa(args, fn)

Fill in the arguments `args` at the end of `fn`'s arguments list.

## ap.apa(left, right, fn)

Fill in `left` arguments starting from the beginning of `fn`'s argument list and
`right` arguments starting from the end.

## ap.partial(fn, args...)

Fill in `fn`'s arguments with `args...` from the beginning of `fn`'s arguments
list.

## ap.partialRight(fn, args...)

Fill in `fn`'s arguments with `args...` starting from the end of `fn`'s
arguments list.

## ap.curry(fn, args...)

Curry `fn`, returning a new function with `args...` partially applied from the
beginning of `fn`'s arguments list.

## ap.curryRight(fn, args...)

Curry `fn` returning a new function with `args...` partially applied from the
end of `fn`'s arguments list.
