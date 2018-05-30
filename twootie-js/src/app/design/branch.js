"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commonFunctions_1 = require("../util/commonFunctions");
var parser_1 = require("../util/parser");
var Branch = (function () {
    function Branch(_id, _parentId, _problemSentences, _closed) {
        if (_closed === void 0) { _closed = false; }
        this._id = _id;
        this._parentId = _parentId;
        this._problemSentences = _problemSentences;
        this._closed = _closed;
        this._sentenceLineNumbers = new Map();
        this._checkedOffLines = new Set();
        this._errorText = "";
        for (var i = 0; i < this._problemSentences.length; i++) {
            var curProblemSentence = this._problemSentences[i];
            if (this._sentenceLineNumbers.has(curProblemSentence.lineNumber)) {
                // throw error here
            }
            else {
                this._sentenceLineNumbers.set(curProblemSentence.lineNumber, curProblemSentence);
            }
        }
    }
    Object.defineProperty(Branch.prototype, "id", {
        get: function () {
            return this._id;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Branch.prototype, "parentId", {
        get: function () {
            return this._parentId;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Branch.prototype, "problemSentences", {
        get: function () {
            return this._problemSentences;
        },
        enumerable: true,
        configurable: true
    });
    Branch.prototype.getProblemSentence = function (lineNumber) {
        return this._sentenceLineNumbers.get(lineNumber);
    };
    Branch.prototype.setProblemSentences = function (problemSentences) {
        this._problemSentences = problemSentences;
    };
    Branch.prototype.addProblemSentence = function (problemSentence) {
        if (this._sentenceLineNumbers.has(problemSentence.lineNumber)) {
            // throw error
        }
        else {
            this._problemSentences.push(problemSentence);
            this._sentenceLineNumbers.set(problemSentence.lineNumber, problemSentence);
        }
    };
    Branch.prototype.hasLine = function (line) {
        return this._sentenceLineNumbers.has(line);
    };
    Object.defineProperty(Branch.prototype, "closed", {
        get: function () {
            return this._closed;
        },
        enumerable: true,
        configurable: true
    });
    Branch.prototype.setClosed = function (closed) {
        this._closed = closed;
    };
    Object.defineProperty(Branch.prototype, "checkedOffLines", {
        get: function () {
            return this._checkedOffLines;
        },
        enumerable: true,
        configurable: true
    });
    Branch.prototype.addCheckedOffLine = function (line) {
        this._checkedOffLines.add(line);
    };
    Object.defineProperty(Branch.prototype, "errorText", {
        get: function () {
            return this._errorText;
        },
        enumerable: true,
        configurable: true
    });
    Branch.prototype.setErrorText = function (errorText) {
        this._errorText = errorText;
    };
    Branch.prototype.resetErrorText = function () {
        this.setErrorText("");
    };
    Branch.prototype.largestLineNumber = function () {
        return Math.max.apply(Math, this._problemSentences.map(function (problemSentence) { return problemSentence.lineNumber; }));
    };
    Object.defineProperty(Branch.prototype, "variables", {
        get: function () {
            var allVars = commonFunctions_1.mergeSets(this.problemSentences.map(function (problemSentence) {
                return problemSentence.sentence.variables;
            }));
            commonFunctions_1.removeFromSet(allVars, parser_1.FREE_VARS);
            return allVars;
        },
        enumerable: true,
        configurable: true
    });
    Branch.prototype.getLineFreeVarSubstitutions = function (freeVar, line) {
        var problemSentence = this.getProblemSentence(line);
        if (commonFunctions_1.isPresent(problemSentence)) {
            var freeVarSubstitutions = problemSentence.freeVarsSubstitutionMap.get(freeVar);
            if (commonFunctions_1.isPresent(freeVarSubstitutions)) {
                return freeVarSubstitutions;
            }
        }
        return new Set();
    };
    Branch.prototype.addLineFreeVarSubstitution = function (line, freeVar, substitution) {
        var problemSentence = this.getProblemSentence(line);
        if (commonFunctions_1.isPresent(problemSentence)) {
            problemSentence.addFreeVarSubstitution(freeVar, substitution);
        }
    };
    return Branch;
}());
exports.Branch = Branch;
//# sourceMappingURL=branch.js.map