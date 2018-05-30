"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var sentence_1 = require("./sentence");
var SimpleSentence = (function (_super) {
    __extends(SimpleSentence, _super);
    function SimpleSentence(numNegated, _value, _variables) {
        if (_variables === void 0) { _variables = []; }
        var _this = _super.call(this, numNegated, sentence_1.SentenceType.simpleSentence) || this;
        _this._value = _value;
        _this._variables = _variables;
        return _this;
    }
    Object.defineProperty(SimpleSentence.prototype, "value", {
        get: function () {
            return this._value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimpleSentence.prototype, "variables", {
        get: function () {
            return new Set(this._variables);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(SimpleSentence.prototype, "children", {
        get: function () {
            return [];
        },
        enumerable: true,
        configurable: true
    });
    SimpleSentence.prototype.replaceFreeVariables = function (freeVar, constant) {
        this._variables = this._variables.join("").replace(new RegExp(freeVar, "g"), constant).split("");
    };
    SimpleSentence.prototype.toString = function () {
        return sentence_1.negatedToString(this._numNegated) + this._value + this._variables.join("");
    };
    SimpleSentence.prototype.copy = function () {
        return new SimpleSentence(this._numNegated, this._value, this._variables);
    };
    SimpleSentence.prototype.copyWithExtraNegated = function (extraNegated) {
        return new SimpleSentence(this._numNegated + extraNegated, this._value, this._variables);
    };
    SimpleSentence.createDefault = function () {
        return new SimpleSentence(0, "");
    };
    return SimpleSentence;
}(sentence_1.Sentence));
exports.SimpleSentence = SimpleSentence;
//# sourceMappingURL=simpleSentence.js.map