"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isPresent(obj) {
    return obj !== undefined && obj !== null;
}
exports.isPresent = isPresent;
function stripBrackets(str) {
    if (str[0] === "(" && str[str.length - 1] === ")") {
        var curBrackets = 1;
        for (var i = 1; i < str.length - 1; i++) {
            if (str[i] === "(") {
                curBrackets++;
            }
            else if (str[i] === ")") {
                curBrackets--;
            }
            if (curBrackets === 0) {
                return str;
            }
        }
        str = str.slice(1, -1);
    }
    return str;
}
exports.stripBrackets = stripBrackets;
function mergeSets(sets) {
    return new Set([].concat.apply([], sets.map(function (curSet) { return Array.from(curSet); })));
}
exports.mergeSets = mergeSets;
function eqSets(a, b) {
    if (a.size !== b.size)
        return false;
    return Array.from(a).every(function (element) { return b.has(element); });
}
exports.eqSets = eqSets;
function removeFromSet(a, toRemove) {
    toRemove.forEach(function (value) { return a.delete(value); });
}
exports.removeFromSet = removeFromSet;
//# sourceMappingURL=commonFunctions.js.map