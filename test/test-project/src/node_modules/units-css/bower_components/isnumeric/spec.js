describe("isNumeric", function() {

    it("should have a global isNumeric object", function() {
        expect(isNumeric).toBeDefined();
    });

    it("should return true for integers", function() {
        expect(isNumeric(1)).toBeTruthy();
        expect(isNumeric(-1)).toBeTruthy();
        expect(isNumeric(0)).toBeTruthy();
        expect(isNumeric("1")).toBeTruthy();
        expect(isNumeric("-1")).toBeTruthy();
        expect(isNumeric("0")).toBeTruthy();
        expect(isNumeric("1.")).toBeTruthy();
    });

    it("should return true for min / max numbers", function() {
        expect(isNumeric(Number.MAX_VALUE)).toBeTruthy();
        expect(isNumeric(Number.MIN_VALUE)).toBeTruthy();
    });

    it("should return true for octals", function() {
        expect(isNumeric(0144)).toBeTruthy();
        expect(isNumeric("0144")).toBeTruthy();
    });

    it("should return true for hexadecimals", function() {
        expect(isNumeric(0xFF)).toBeTruthy();
        expect(isNumeric("0xFF")).toBeTruthy();
    });

    it("should return true for floating-points", function() {
        expect(isNumeric(1.1)).toBeTruthy();
        expect(isNumeric(0.1)).toBeTruthy();
        expect(isNumeric(-1.1)).toBeTruthy();
        expect(isNumeric(-0.1)).toBeTruthy();
        expect(isNumeric("1.1")).toBeTruthy();
        expect(isNumeric("0.1")).toBeTruthy();
        expect(isNumeric("-1.1")).toBeTruthy();
        expect(isNumeric("-0.1")).toBeTruthy();
        expect(isNumeric(".1")).toBeTruthy();
    });

    it("should return true for exponentials", function() {
        expect(isNumeric(3e5)).toBeTruthy();
        expect(isNumeric(123e-2)).toBeTruthy();
        expect(isNumeric("3e5")).toBeTruthy();
        expect(isNumeric("123e-2")).toBeTruthy();
    });

    it("should return true with decimal commas", function() {
        expect(isNumeric(1,1)).toBeTruthy();
        expect(isNumeric("1,1")).toBeTruthy();
    });

    it("should return true for multiple commas", function() {
        expect(isNumeric("1,1,1")).toBeTruthy();
        expect(isNumeric("1,1,1,1")).toBeTruthy();
    });

    it("should return false for empty / whitespace", function() {
        expect(isNumeric()).toBeFalsy();
        expect(isNumeric("")).toBeFalsy();
        expect(isNumeric("    ")).toBeFalsy();
        expect(isNumeric("  ")).toBeFalsy();
        expect(isNumeric("\t")).toBeFalsy();
        expect(isNumeric("\n")).toBeFalsy();
        expect(isNumeric("\r")).toBeFalsy();
    });

    it("should return false for strings that aren't numeric", function() {
        expect(isNumeric("ABC")).toBeFalsy();
        expect(isNumeric("abc")).toBeFalsy();
        expect(isNumeric("ABC123")).toBeFalsy();
        expect(isNumeric("abc123")).toBeFalsy();
        expect(isNumeric("123ABC")).toBeFalsy();
        expect(isNumeric("123abc")).toBeFalsy();
    });

    it("should return false for multiple decimals", function() {
        expect(isNumeric("1.1.1")).toBeFalsy();
        expect(isNumeric("1.1.1.1")).toBeFalsy();
    });

    it("should return false for booleans", function() {
        expect(isNumeric(true)).toBeFalsy();
        expect(isNumeric(false)).toBeFalsy();
    });

    it("should return false for null / undefined / NaN", function() {
        expect(isNumeric(null)).toBeFalsy();
        expect(isNumeric(undefined)).toBeFalsy();
        expect(isNumeric(NaN)).toBeFalsy();
    });

    it("should return false for infinity and Number._INFINITY (ironically)", function() {
        expect(isNumeric(Infinity)).toBeFalsy();
        expect(isNumeric(Number.POSITIVE_INFINITY)).toBeFalsy();
        expect(isNumeric(Number.NEGATIVE_INFINITY)).toBeFalsy();
    });

    it("should return false for dates", function() {
        expect(isNumeric(new Date())).toBeFalsy();
        expect(isNumeric(new Date(2000, 1, 1))).toBeFalsy();
    });

    it("should return false for arrays", function() {
        expect(isNumeric([])).toBeFalsy();
        expect(isNumeric([1])).toBeFalsy();
        expect(isNumeric([1, 2])).toBeFalsy();
        expect(isNumeric(["a"])).toBeFalsy();
        expect(isNumeric(["a", "b"])).toBeFalsy();
    });

    it("should return false for empty objects", function() {
        expect(isNumeric({})).toBeFalsy();
    });

    it("should return false for functions", function() {
        expect(isNumeric(function() { })).toBeFalsy();
        expect(isNumeric(function(a) { })).toBeFalsy();
        expect(isNumeric(function() { return "a"; })).toBeFalsy();
        expect(isNumeric(function() { return 1; })).toBeFalsy();
    });

});
