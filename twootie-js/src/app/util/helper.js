"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var problem_1 = require("../design/problem");
var parser_1 = require("./parser");
var problemSentence_1 = require("../design/problemSentence");
var problemSet_1 = require("./problemSet");
var probSet = new problemSet_1.ProblemSet();
function createMockProblem() {
    return new problem_1.Problem([]);
}
exports.createMockProblem = createMockProblem;
function createEmptyProblem() {
    return new problem_1.Problem([]);
}
exports.createEmptyProblem = createEmptyProblem;
function parseProblemSentence(newProblemObj) {
    var newSentenceArr = [];
    if (typeof newProblemObj.sentences !== 'undefined') {
        for (var _i = 0, _a = newProblemObj.sentences; _i < _a.length; _i++) {
            var sentence = _a[_i];
            var s = new problemSentence_1.ProblemSentence(sentence.line, parser_1.parseStringToSentence(sentence.sen), parser_1.parseStringToJustification(sentence.just), sentence.br);
            newSentenceArr.push(s);
        }
    }
    return newSentenceArr;
}
function createSLProblem() {
    var pid = 1;
    var newProblemObj = probSet.getSlProbId(pid);
    var newSentenceArr = parseProblemSentence(newProblemObj);
    var problem = new problem_1.Problem(newSentenceArr);
    problem.setProbId(pid);
    return problem;
}
exports.createSLProblem = createSLProblem;
function createPLProblem() {
    var pid = 1;
    var newProblemObj = probSet.getPlProbId(pid);
    var newSentenceArr = parseProblemSentence(newProblemObj);
    var problem = new problem_1.Problem(newSentenceArr);
    problem.setProbId(pid);
    return problem;
}
exports.createPLProblem = createPLProblem;
function getNextPLProblem(lastPid) {
    var nextPid = lastPid + 1;
    var newProblemObj;
    if (!probSet.hasProbWithId(nextPid, "PL")) {
        nextPid = 1;
    }
    newProblemObj = probSet.getPlProbId(nextPid);
    var newSentenceArr = parseProblemSentence(newProblemObj);
    var nextProb = new problem_1.Problem(newSentenceArr);
    nextProb.setProbId(nextPid);
    return nextProb;
}
exports.getNextPLProblem = getNextPLProblem;
function noSentenceConflicts(simpleSentences) {
    var valueMap = new Map();
    for (var i = 0; i < simpleSentences.length; i++) {
        var curSentence = simpleSentences[i];
        if (valueMap.has(curSentence.value)) {
            if ((valueMap.get(curSentence.value) - curSentence.numNegated) % 2 !== 0) {
                return false;
            }
        }
        else {
            valueMap.set(curSentence.value, curSentence.numNegated);
        }
    }
    return true;
}
exports.noSentenceConflicts = noSentenceConflicts;
//# sourceMappingURL=helper.js.map