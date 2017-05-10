var test = require("tap").test;

var ap = require('../');
var pa = ap.pa;
var apa = ap.apa;
var partial = ap.partial;
var partialRight = ap.partialRight;
var curry = ap.curry;
var curryRight = ap.curryRight;

function one(x, y) {
    return x * 2 + y
}

function two(x, y, z, w) {
    return x * 2 + (y + z) * w
}

function three(x, y) {
    return this.z * (x * 2 + y)
}

var z = {
    z: 10
};

test("ap function", function (t) {
    var apOne = ap([3], one);
    t.equal(apOne(4),
        3 * 2 + 4);

    var apTwo = ap([3,4], two);
    t.equal(apTwo(5, 6),
        3 * 2 + (4 + 5) * 6);

    var apThree = ap([3], three);
    t.equal(apThree.call(z, 4),
        10 * (3 * 2 + 4));

    t.end();
});

test("pa function", function (t) {
    var paOne = pa([3], one);
    t.equal(paOne(4),
        4 * 2 + 3);

    var paTwo = pa([3,4], two);
    t.equal(paTwo(5, 6),
        5 * 2 + (6 + 3) * 4);

    var paThree = pa([3], three);
    t.equal(paThree.call(z, 4),
        10 * (4 * 2 + 3));

    t.end();
});

test("apa function", function (t) {
    var apaOne = apa([3], [4], one);
    t.equal(apaOne(),
        3 * 2 + 4);

    var apaTwo = apa([3], [4], two);
    t.equal(apaTwo(5, 6),
        3 * 2 + (5 + 6) * 4);

    var apaThree = apa([3], [4], three);
    t.equal(apaThree.call(z),
        10 * (3 * 2 + 4));

    t.end();
});

test("partial function", function (t) {
    var apOne = partial(one, 3);
    t.equal(apOne(4),
        3 * 2 + 4);

    var apTwo = partial(two, 3, 4);
    t.equal(apTwo(5, 6),
        3 * 2 + (4 + 5) * 6);

    var apThree = partial(three, 3);
    t.equal(apThree.call(z, 4),
        10 * (3 * 2 + 4));

    t.end();
});

test("partialRight function", function (t) {
    var paOne = partialRight(one, 3);
    t.equal(paOne(4),
        4 * 2 + 3);

    var paTwo = partialRight(two, 3, 4);
    t.equal(paTwo(5, 6),
        5 * 2 + (6 + 3) * 4);

    var paThree = partialRight(three, 3);
    t.equal(paThree.call(z, 4),
        10 * (4 * 2 + 3));

    t.end();
});

test("curry function", function (t) {
    var apOne = curry(one)(3);
    t.equal(apOne(4),
        3 * 2 + 4, "curry one");

    var apTwo = curry(two)(3, 4);
    t.equal(apTwo(5, 6),
        3 * 2 + (4 + 5) * 6, "curry two");

    var apThree = curry(three)(3);
    t.equal(apThree.call(z, 4),
        10 * (3 * 2 + 4), "curry three");

    t.end();
});

test("curryRight function", function (t) {
    var paOne = curryRight(one)(3);
    t.equal(paOne(4),
        4 * 2 + 3);

    var paTwo = curryRight(two)(3, 4);
    t.equal(paTwo(5, 6),
        5 * 2 + (6 + 3) * 4);

    var paThree = curryRight(three)(3);
    t.equal(paThree.call(z, 4),
        10 * (4 * 2 + 3));

    t.end();
});
