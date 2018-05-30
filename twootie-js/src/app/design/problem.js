"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var branch_1 = require("./branch");
var parser_1 = require("../util/parser");
var decomposer_1 = require("../util/decomposer");
var commonFunctions_1 = require("../util/commonFunctions");
var sentence_1 = require("./sentence");
var helper_1 = require("../util/helper");
var Problem = (function () {
    function Problem(_startingBranchSentences) {
        this._startingBranchSentences = _startingBranchSentences;
        this.branchMap = new Map();
        this.branchChildrenMap = new Map();
        this._maxBranchId = -1;
        this._completed = false;
        this.setStartingBranch();
    }
    Object.defineProperty(Problem.prototype, "startingBranchSentences", {
        get: function () {
            return this._startingBranchSentences;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Problem.prototype, "completed", {
        get: function () {
            return this._completed;
        },
        enumerable: true,
        configurable: true
    });
    Problem.prototype.decompose = function (branchId, justificationStr) {
        this.getBranchFromId(branchId).resetErrorText();
        if (justificationStr.toLowerCase() === 'x') {
            this.closeBranch(branchId);
        }
        else if (justificationStr.toLowerCase() === 'open') {
            this.openBranch(branchId);
        }
        else {
            var justification = parser_1.parseStringToJustification(justificationStr);
            decomposer_1.Decomposer.decompose(this, branchId, justification);
        }
    };
    Problem.prototype.addChildBranch = function (parentId, problemSentences) {
        var branchId = this._maxBranchId + 1;
        this.branchMap.set(branchId, new branch_1.Branch(branchId, parentId, problemSentences, false));
        if (this.branchChildrenMap.has(parentId)) {
            this.branchChildrenMap.get(parentId).push(branchId);
        }
        else {
            this.branchChildrenMap.set(parentId, [branchId]);
        }
        this._maxBranchId = branchId;
    };
    Problem.prototype.getBranchFromId = function (branchId) {
        return this.branchMap.get(branchId);
    };
    Problem.prototype.branchHasChild = function (branchId) {
        return this.branchChildrenMap.has(branchId);
    };
    Problem.prototype.getChildBranches = function (branchId) {
        if (this.branchHasChild(branchId)) {
            return this.branchChildrenMap.get(branchId);
        }
        return [];
    };
    Problem.prototype.getProblemSentence = function (branchId, line) {
        var branch = this.getBranchFromId(branchId);
        if (!commonFunctions_1.isPresent(branch)) {
            return undefined;
        }
        var problemSentence = branch.getProblemSentence(line);
        if (!commonFunctions_1.isPresent(problemSentence)) {
            return this.getProblemSentence(branch.parentId, line);
        }
        return problemSentence;
    };
    Problem.prototype.checkOff = function (branchId, problemSentence) {
        var line = problemSentence.lineNumber;
        var ancestorWithLine = this.getAncestorWithLine(branchId, line);
        if (this.lineShouldCheckOff(ancestorWithLine, line)) {
            problemSentence.setCheckedOff(true);
        }
    };
    Problem.prototype.getAncestorWithLine = function (branchId, line) {
        var curBranchId = branchId;
        while (!this.getBranchFromId(curBranchId).hasLine(line) &&
            curBranchId !== -1) {
            curBranchId = this.getBranchFromId(curBranchId).parentId;
        }
        return curBranchId;
    };
    Problem.prototype.getBranchVariables = function (branchId, curVariables) {
        if (curVariables === void 0) { curVariables = new Set(); }
        if (branchId === -1) {
            return curVariables;
        }
        var curBranch = this.getBranchFromId(branchId);
        return this.getBranchVariables(curBranch.parentId, commonFunctions_1.mergeSets([curVariables, curBranch.variables]));
    };
    Problem.prototype.lineShouldCheckOff = function (originBranchId, line) {
        var _this = this;
        if (this.getBranchFromId(originBranchId).checkedOffLines.has(line)) {
            return true;
        }
        if (this.getChildBranches(originBranchId).length === 0) {
            return false;
        }
        return this.getChildBranches(originBranchId).every(function (childId) {
            return _this.lineShouldCheckOff(childId, line);
        });
    };
    Problem.prototype.branchHasCheckedOffLine = function (branchId, line) {
        var curBranchId = branchId;
        while (curBranchId !== -1) {
            var curBranch = this.getBranchFromId(curBranchId);
            if (curBranch.checkedOffLines.has(line)) {
                return true;
            }
            curBranchId = curBranch.parentId;
        }
        return false;
    };
    Problem.prototype.getLineFreeVarSubstitutions = function (branchId, freeVar, line) {
        var ancestorWithLine = this.getAncestorWithLine(branchId, line);
        return this.getBranchFromId(ancestorWithLine).getLineFreeVarSubstitutions(freeVar, line);
    };
    Problem.prototype.addFreeVarSubstitution = function (branchId, line, freeVar, substitution) {
        var ancestorWithLine = this.getAncestorWithLine(branchId, line);
        this.getBranchFromId(ancestorWithLine).addLineFreeVarSubstitution(line, freeVar, substitution);
    };
    Problem.prototype.closeBranch = function (branchId) {
        var simpleProblemSentences = this.allBranchProblemSentences(branchId)
            .filter(function (problemSentence) { return problemSentence.sentence.type === sentence_1.SentenceType.simpleSentence; })
            .map(function (problemSentence) { return problemSentence.sentence; });
        if (!helper_1.noSentenceConflicts(simpleProblemSentences)) {
            this.getBranchFromId(branchId).setClosed(true);
            this.getBranchFromId(branchId).setErrorText('');
            if (this.allBranchesClosed()) {
                alert('Tree is closed');
                return;
            }
        }
        else {
            this.getBranchFromId(branchId).setErrorText('I did not find an ATOMIC SENTENCE and its negation on that branch!');
            return;
        }
    };
    Problem.prototype.allBranchesClosed = function () {
        var branchesToTraverse = [0];
        while (branchesToTraverse.length !== 0) {
            var curBranchId = branchesToTraverse.shift();
            if (!this.branchHasChild(curBranchId) && !this.getBranchFromId(curBranchId).closed) {
                return false;
            }
            branchesToTraverse = branchesToTraverse.concat(this.getChildBranches(curBranchId));
        }
        return true;
    };
    Problem.prototype.openBranch = function (branchId) {
        if (this.branchFinishedDecomposing(branchId)) {
            var simpleProblemSentences = this.allBranchProblemSentences(branchId)
                .filter(function (problemSentence) { return problemSentence.sentence.type === sentence_1.SentenceType.simpleSentence; })
                .map(function (problemSentence) { return problemSentence.sentence; });
            if (helper_1.noSentenceConflicts(simpleProblemSentences)) {
                this.getBranchFromId(branchId).setErrorText('');
                alert('You are correct! You have a completed open branch.');
                this._completed = true;
                return;
            }
            else {
                this.getBranchFromId(branchId).setErrorText('Sorry, your current branch is CLOSED, not OPEN!');
                return;
            }
        }
        else {
            this.getBranchFromId(branchId).setErrorText('Sorry, your current branch is not complete.');
            return;
        }
    };
    Problem.prototype.branchFinishedDecomposing = function (branchId) {
        var problemSentences = this.allBranchProblemSentences(branchId);
        var checkedOff = this.allBranchCheckedOff(branchId);
        for (var i = 0; i < problemSentences.length; i++) {
            var curProblemSentence = problemSentences[i];
            if (!curProblemSentence.checkedOff && !checkedOff.has(curProblemSentence.lineNumber)) {
                if (curProblemSentence.sentence.type === sentence_1.SentenceType.quantifiedSentence) {
                    var quantifiedSentence = curProblemSentence.sentence;
                    var substitutions = this.getLineFreeVarSubstitutions(branchId, quantifiedSentence.quantifierValue, curProblemSentence.lineNumber);
                    if (!commonFunctions_1.eqSets(substitutions, this.getBranchVariables(branchId))) {
                        return false;
                    }
                }
                else {
                    return false;
                }
            }
        }
        return true;
    };
    Problem.prototype.allBranchProblemSentences = function (branchId) {
        var curBranchId = branchId;
        var problemSentences = [];
        while (curBranchId !== -1) {
            var curBranch = this.getBranchFromId(curBranchId);
            problemSentences = problemSentences.concat(curBranch.problemSentences);
            curBranchId = curBranch.parentId;
        }
        return problemSentences;
    };
    Problem.prototype.allBranchCheckedOff = function (branchId) {
        var curBranchId = branchId;
        var checkedOff = new Set();
        while (curBranchId !== -1) {
            var curBranch = this.getBranchFromId(curBranchId);
            checkedOff = commonFunctions_1.mergeSets([checkedOff, curBranch.checkedOffLines]);
            curBranchId = curBranch.parentId;
        }
        return checkedOff;
    };
    Problem.prototype.reset = function () {
        this.branchMap = new Map();
        this.branchChildrenMap = new Map();
        this._maxBranchId = -1;
        this.setStartingBranch();
    };
    Problem.prototype.setStartingBranch = function () {
        this.addChildBranch(-1, this._startingBranchSentences.map(function (startingSentence) { return startingSentence.copy(); }));
    };
    Problem.prototype.selectBranch = function (brId) {
        if (brId !== 0) {
            if (brId === this.selectedBranch) {
                this.selectedBranch = null;
            }
            else {
                this.selectedBranch = brId;
            }
        }
    };
    return Problem;
}());
exports.Problem = Problem;
//# sourceMappingURL=problem.js.map