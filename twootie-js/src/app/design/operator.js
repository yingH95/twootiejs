"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Operator;
(function (Operator) {
    Operator[Operator["conjunction"] = 0] = "conjunction";
    Operator[Operator["disjunction"] = 1] = "disjunction";
    Operator[Operator["conditional"] = 2] = "conditional";
    Operator[Operator["biconditional"] = 3] = "biconditional";
    Operator[Operator["equality"] = 4] = "equality";
})(Operator = exports.Operator || (exports.Operator = {}));
function operatorToString(operator) {
    switch (operator) {
        case Operator.conjunction:
            return "&";
        case Operator.disjunction:
            return "v";
        case Operator.conditional:
            return "→";
        case Operator.biconditional:
            return "≡";
        case Operator.equality:
            return "=";
    }
}
exports.operatorToString = operatorToString;
function stringToOperator(str) {
    switch (str) {
        case "&":
            return Operator.conjunction;
        case "v":
            return Operator.disjunction;
        case ">":
        case "→":
            return Operator.conditional;
        case "≡":
        case "<":
            return Operator.biconditional;
        case "=":
            return Operator.equality;
    }
}
exports.stringToOperator = stringToOperator;
//# sourceMappingURL=operator.js.map