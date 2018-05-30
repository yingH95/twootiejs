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
var EqualitySentence = (function (_super) {
    __extends(EqualitySentence, _super);
    function EqualitySentence(numNegated, _left, _right) {
        var _this = _super.call(this, numNegated, sentence_1.SentenceType.equalitySentence) || this;
        _this._left = _left;
        _this._right = _right;
        return _this;
    }
    Object.defineProperty(EqualitySentence.prototype, "left", {
        get: function () {
            return this._left;
        },
        set: function (left) {
            this._left = left;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EqualitySentence.prototype, "right", {
        get: function () {
            return this._right;
        },
        set: function (right) {
            this._right = right;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(EqualitySentence.prototype, "children", {
        get: function () {
            return [];
        },
        enumerable: true,
        configurable: true
    });
    EqualitySentence.prototype.toString = function () {
        return sentence_1.negatedToString(this._numNegated) + this._left + " "
            + operator_1.operatorToString(operator_1.Operator.equality) + " " + this._right;
    };
    EqualitySentence.prototype.copy = function () {
        return new EqualitySentence(this._numNegated, this._left, this._right);
    };
    EqualitySentence.prototype.copyWithExtraNegated = function (extraNegated) {
        return new EqualitySentence(this._numNegated + extraNegated, this._left, this._right);
    };
    return EqualitySentence;
}(sentence_1.Sentence));
exports.EqualitySentence = EqualitySentence;
//# sourceMappingURL=equalitySentence.js.map