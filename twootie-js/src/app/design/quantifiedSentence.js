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
var quantifier_1 = require("./quantifier");
var QuantifiedSentence = (function (_super) {
    __extends(QuantifiedSentence, _super);
    function QuantifiedSentence(numNegated, _quantifier, _quantifierValue, _childSentence) {
        var _this = _super.call(this, numNegated, sentence_1.SentenceType.quantifiedSentence) || this;
        _this._quantifier = _quantifier;
        _this._quantifierValue = _quantifierValue;
        _this._childSentence = _childSentence;
        return _this;
    }
    Object.defineProperty(QuantifiedSentence.prototype, "quantifier", {
        get: function () {
            return this._quantifier;
        },
        enumerable: true,
        configurable: true
    });
    QuantifiedSentence.prototype.setQuantifier = function (quantifier) {
        this._quantifier = quantifier;
    };
    Object.defineProperty(QuantifiedSentence.prototype, "quantifierValue", {
        get: function () {
            return this._quantifierValue;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuantifiedSentence.prototype, "childSentence", {
        get: function () {
            return this._childSentence;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(QuantifiedSentence.prototype, "children", {
        get: function () {
            return [this._childSentence];
        },
        enumerable: true,
        configurable: true
    });
    QuantifiedSentence.prototype.toString = function () {
        var quantifierString = "(" + quantifier_1.quantifierToString(this._quantifier) + this._quantifierValue + ")";
        var childString = this._childSentence.toString();
        if (this._childSentence.type === sentence_1.SentenceType.compoundSentence) {
            childString = "(" + childString + ")";
        }
        return sentence_1.negatedToString(this._numNegated) + quantifierString + " " + childString;
    };
    QuantifiedSentence.prototype.copy = function () {
        return new QuantifiedSentence(this._numNegated, this._quantifier, this._quantifierValue, this._childSentence.copy());
    };
    QuantifiedSentence.prototype.copyWithExtraNegated = function (extraNegated) {
        return new QuantifiedSentence(this._numNegated + extraNegated, this._quantifier, this._quantifierValue, this._childSentence.copy());
    };
    QuantifiedSentence.prototype.copyWithExtraNegatedChild = function (extraNegated) {
        return new QuantifiedSentence(this._numNegated + extraNegated, this._quantifier, this._quantifierValue, this._childSentence.copyWithExtraNegated(1));
    };
    return QuantifiedSentence;
}(sentence_1.Sentence));
exports.QuantifiedSentence = QuantifiedSentence;
//# sourceMappingURL=quantifiedSentence.js.map