"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sentence_1 = require("./sentence");
var ProblemSentence = (function () {
    function ProblemSentence(_lineNumber, _sentence, _justification, _branchId) {
        this._lineNumber = _lineNumber;
        this._sentence = _sentence;
        this._justification = _justification;
        this._branchId = _branchId;
        this._checkedOff = false;
        this._freeVarsSubstitutionMap = new Map();
        if (this._sentence.type === sentence_1.SentenceType.simpleSentence &&
            this._sentence.numNegated <= 1) {
            this._checkedOff = true;
        }
    }
    Object.defineProperty(ProblemSentence.prototype, "branchId", {
        get: function () {
            return this._branchId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemSentence.prototype, "lineNumber", {
        get: function () {
            return this._lineNumber;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemSentence.prototype, "sentence", {
        get: function () {
            return this._sentence;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemSentence.prototype, "justification", {
        get: function () {
            return this._justification.toString();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ProblemSentence.prototype, "checkedOff", {
        get: function () {
            return this._checkedOff;
        },
        enumerable: true,
        configurable: true
    });
    ProblemSentence.prototype.setCheckedOff = function (checkedOff) {
        this._checkedOff = checkedOff;
    };
    Object.defineProperty(ProblemSentence.prototype, "freeVarsSubstitutionMap", {
        get: function () {
            return this._freeVarsSubstitutionMap;
        },
        enumerable: true,
        configurable: true
    });
    ProblemSentence.prototype.addFreeVarSubstitution = function (freeVar, substitution) {
        if (this._freeVarsSubstitutionMap.has(freeVar)) {
            this._freeVarsSubstitutionMap.get(freeVar).add(substitution);
        }
        else {
            this._freeVarsSubstitutionMap.set(freeVar, new Set(substitution));
        }
    };
    ProblemSentence.prototype.copy = function () {
        return new ProblemSentence(this._lineNumber, this._sentence.copy(), this._justification, this._branchId);
    };
    return ProblemSentence;
}());
exports.ProblemSentence = ProblemSentence;
//# sourceMappingURL=problemSentence.js.map