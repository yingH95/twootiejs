"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule_1 = require("./rule");
var Justification = (function () {
    function Justification(_lines, _decompositionRule, _result) {
        if (_result === void 0) { _result = ""; }
        this._lines = _lines;
        this._decompositionRule = _decompositionRule;
        this._result = _result;
    }
    Object.defineProperty(Justification.prototype, "result", {
        get: function () {
            return this._result;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Justification.prototype, "lines", {
        get: function () {
            return this._lines;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Justification.prototype, "decompositionRule", {
        get: function () {
            return this._decompositionRule;
        },
        enumerable: true,
        configurable: true
    });
    Justification.prototype.toString = function () {
        if (this._decompositionRule.rule === rule_1.Rule.SM) {
            return this._decompositionRule.toString();
        }
        return this._lines + " " + this._decompositionRule.toString();
    };
    return Justification;
}());
exports.Justification = Justification;
//# sourceMappingURL=justification.js.map