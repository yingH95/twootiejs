"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Quantifier;
(function (Quantifier) {
    Quantifier[Quantifier["universal"] = 0] = "universal";
    Quantifier[Quantifier["existential"] = 1] = "existential";
})(Quantifier = exports.Quantifier || (exports.Quantifier = {}));
function quantifierToString(quantifier) {
    switch (quantifier) {
        case Quantifier.universal:
            return "∀";
        case Quantifier.existential:
            return "∃";
    }
}
exports.quantifierToString = quantifierToString;
function stringToQuantifier(str) {
    switch (str) {
        case "V":
            return Quantifier.universal;
        case "]":
            return Quantifier.existential;
    }
}
exports.stringToQuantifier = stringToQuantifier;
//# sourceMappingURL=quantifier.js.map