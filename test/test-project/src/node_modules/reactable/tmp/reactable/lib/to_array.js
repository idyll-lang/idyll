(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports);
        global.to_array = mod.exports;
    }
})(this, function (exports) {
    "use strict";

    exports.toArray = toArray;

    function toArray(obj) {
        var ret = [];
        for (var attr in obj) {
            ret[attr] = obj;
        }

        return ret;
    }
});
