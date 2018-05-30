"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commonFunctions_1 = require("../util/commonFunctions");
var SentenceType;
(function (SentenceType) {
    SentenceType[SentenceType["simpleSentence"] = 0] = "simpleSentence";
    SentenceType[SentenceType["compoundSentence"] = 1] = "compoundSentence";
    SentenceType[SentenceType["quantifiedSentence"] = 2] = "quantifiedSentence";
    SentenceType[SentenceType["equalitySentence"] = 3] = "equalitySentence";
})(SentenceType = exports.SentenceType || (exports.SentenceType = {}));
var Sentence = (function () {
    function Sentence(_numNegated, _type) {
        this._numNegated = _numNegated;
        this._type = _type;
    }
    Object.defineProperty(Sentence.prototype, "numNegated", {
        get: function () {
            return this._numNegated;
        },
        enumerable: true,
        configurable: true
    });
    Sentence.prototype.setNumNegated = function (numNegated) {
        this._numNegated = numNegated;
    };
    Object.defineProperty(Sentence.prototype, "type", {
        get: function () {
            return this._type;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sentence.prototype, "variables", {
        get: function () {
            return commonFunctions_1.mergeSets(this.children.map(function (child) { return child.variables; }));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Sentence.prototype, "hasChildren", {
        get: function () {
            return this.children.length > 0;
        },
        enumerable: true,
        configurable: true
    });
    Sentence.prototype.replaceFreeVariables = function (freeVar, constant) {
        this.children.forEach(function (child) { return child.replaceFreeVariables(freeVar, constant); });
    };
    return Sentence;
}());
exports.Sentence = Sentence;
function negatedToString(numNegated) {
    return "¬".repeat(numNegated);
}
exports.negatedToString = negatedToString;
//# sourceMappingURL=sentence.js.map