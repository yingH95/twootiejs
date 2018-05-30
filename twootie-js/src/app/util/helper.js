"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var problem_1 = require("../design/problem");
var parser_1 = require("./parser");
var problemSentence_1 = require("../design/problemSentence");
function createMockProblem() {
    return new problem_1.Problem([]);
}
exports.createMockProblem = createMockProblem;
function createEmptyProblem() {
    return new problem_1.Problem([]);
}
exports.createEmptyProblem = createEmptyProblem;
function createSLProblem() {
    return new problem_1.Problem([
        new problemSentence_1.ProblemSentence(1, parser_1.parseStringToSentence("((D&K)&J)"), parser_1.parseStringToJustification("/SM"), 0),
        new problemSentence_1.ProblemSentence(2, parser_1.parseStringToSentence("(L&P)"), parser_1.parseStringToJustification("/SM"), 0),
        new problemSentence_1.ProblemSentence(3, parser_1.parseStringToSentence("-(K&L)"), parser_1.parseStringToJustification("/SM"), 0)
    ]);
}
exports.createSLProblem = createSLProblem;
function createPLProblem() {
    return new problem_1.Problem([
        new problemSentence_1.ProblemSentence(1, parser_1.parseStringToSentence("Vx(Gxa>Lxa)"), parser_1.parseStringToJustification("/SM"), 0),
        new problemSentence_1.ProblemSentence(2, parser_1.parseStringToSentence("Gca"), parser_1.parseStringToJustification("/SM"), 0),
        new problemSentence_1.ProblemSentence(3, parser_1.parseStringToSentence("-Lca"), parser_1.parseStringToJustification("/SM"), 0)
    ]);
}
exports.createPLProblem = createPLProblem;
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