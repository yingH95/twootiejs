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
var operator_1 = require("./operator");
var CompoundSentenceChildren = (function () {
    function CompoundSentenceChildren(_left, _right) {
        this._left = _left;
        this._right = _right;
    }
    Object.defineProperty(CompoundSentenceChildren.prototype, "left", {
        get: function () {
            return this._left;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompoundSentenceChildren.prototype, "right", {
        get: function () {
            return this._right;
        },
        enumerable: true,
        configurable: true
    });
    return CompoundSentenceChildren;
}());
exports.CompoundSentenceChildren = CompoundSentenceChildren;
var CompoundSentence = (function (_super) {
    __extends(CompoundSentence, _super);
    function CompoundSentence(numNegated, _operator, _children) {
        var _this = _super.call(this, numNegated, sentence_1.SentenceType.compoundSentence) || this;
        _this._operator = _operator;
        _this._children = _children;
        return _this;
    }
    Object.defineProperty(CompoundSentence.prototype, "operator", {
        get: function () {
            return this._operator;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CompoundSentence.prototype, "children", {
        get: function () {
            return [this._children.left, this._children.right];
        },
        enumerable: true,
        configurable: true
    });
    CompoundSentence.prototype.toString = function () {
        var shouldLeftBracket = this._children.left.type === sentence_1.SentenceType.compoundSentence &&
            this._children.left.numNegated === 0;
        var shouldRightBracket = this._children.right.type === sentence_1.SentenceType.compoundSentence &&
            this._children.right.numNegated === 0;
        var left = this._children.left.toString();
        var right = this._children.right.toString();
        if (shouldLeftBracket) {
            left = "(" + left + ")";
        }
        if (shouldRightBracket) {
            right = "(" + right + ")";
        }
        var result = left + " " + operator_1.operatorToString(this._operator) + " " + right;
        if (this._numNegated > 0) {
            result = sentence_1.negatedToString(this._numNegated) + "( " + result + " )";
        }
        return result;
    };
    CompoundSentence.prototype.copy = function () {
        return new CompoundSentence(this._numNegated, this._operator, new CompoundSentenceChildren(this._children.left.copy(), this._children.right.copy()));
    };
    CompoundSentence.prototype.copyWithExtraNegated = function (extraNegated) {
        return new CompoundSentence(this._numNegated + extraNegated, this._operator, new CompoundSentenceChildren(this._children.left.copy(), this._children.right.copy()));
    };
    return CompoundSentence;
}(sentence_1.Sentence));
exports.CompoundSentence = CompoundSentence;
//# sourceMappingURL=compoundSentence.js.map