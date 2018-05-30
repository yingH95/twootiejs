"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Rule;
(function (Rule) {
    Rule[Rule["negation"] = 0] = "negation";
    Rule[Rule["conjunction"] = 1] = "conjunction";
    Rule[Rule["disjunction"] = 2] = "disjunction";
    Rule[Rule["conditional"] = 3] = "conditional";
    Rule[Rule["biconditional"] = 4] = "biconditional";
    Rule[Rule["universal"] = 5] = "universal";
    Rule[Rule["existential"] = 6] = "existential";
    Rule[Rule["equality"] = 7] = "equality";
    Rule[Rule["SM"] = 8] = "SM";
})(Rule = exports.Rule || (exports.Rule = {}));
var DecompositionRule = (function () {
    function DecompositionRule(_negated, _rule) {
        this._negated = _negated;
        this._rule = _rule;
    }
    Object.defineProperty(DecompositionRule.prototype, "negated", {
        get: function () {
            return this._negated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DecompositionRule.prototype, "rule", {
        get: function () {
            return this._rule;
        },
        enumerable: true,
        configurable: true
    });
    DecompositionRule.prototype.toString = function () {
        if (this._rule === Rule.SM) {
            return ruleToString(this._rule);
        }
        var prefix = "";
        if (this._negated) {
            prefix = "¬";
        }
        return prefix + ruleToString(this._rule) + "D";
    };
    return DecompositionRule;
}());
exports.DecompositionRule = DecompositionRule;
function ruleToString(rule) {
    switch (rule) {
        case Rule.negation:
            return "¬";
        case Rule.conjunction:
            return "&";
        case Rule.disjunction:
            return "v";
        case Rule.conditional:
            return "→";
        case Rule.biconditional:
            return "≡";
        case Rule.universal:
            return "V";
        case Rule.existential:
            return "]";
        case Rule.equality:
            return "=";
        case Rule.SM:
            return "SM";
    }
}
exports.ruleToString = ruleToString;
function stringToDecompositionRule(str) {
    var negated = false;
    if (/[-~¬]/g.test(str[0])) {
        negated = true;
        if (str.length === 1) {
            return new DecompositionRule(false, Rule.negation);
        }
        str = str.slice(1);
    }
    switch (str) {
        case "-":
        case "~":
        case "¬":
            return new DecompositionRule(negated, Rule.negation);
        case "&":
            return new DecompositionRule(negated, Rule.conjunction);
        case "v":
            return new DecompositionRule(negated, Rule.disjunction);
        case ">":
        case "→":
            return new DecompositionRule(negated, Rule.conditional);
        case "<":
        case "≡":
            return new DecompositionRule(negated, Rule.biconditional);
        case "V":
            return new DecompositionRule(negated, Rule.universal);
        case "]":
            return new DecompositionRule(negated, Rule.existential);
        case "=":
            return new DecompositionRule(negated, Rule.equality);
        case "SM":
            return new DecompositionRule(false, Rule.SM);
    }
}
exports.stringToDecompositionRule = stringToDecompositionRule;
//# sourceMappingURL=rule.js.map