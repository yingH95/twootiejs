"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rule_1 = require("../design/rule");
var problemSentence_1 = require("../design/problemSentence");
var sentence_1 = require("../design/sentence");
var operator_1 = require("../design/operator");
var commonFunctions_1 = require("./commonFunctions");
var quantifier_1 = require("../design/quantifier");
var equalitySentence_1 = require("../design/equalitySentence");
var parser_1 = require("./parser");
var Decomposer = (function () {
    function Decomposer() {
    }
    Decomposer.decompose = function (problem, branchId, justification) {
        var branch = problem.getBranchFromId(branchId);
        var nextLineNumber = branch.largestLineNumber() + 1;
        if (nextLineNumber === -Infinity) {
            nextLineNumber = 1;
        }
        if (justification.decompositionRule.rule == rule_1.Rule.equality) {
            if (justification.decompositionRule.negated) {
                branch.setErrorText("There is no negated identity decomposition rule");
                return;
            }
            if (justification.lines.length != 2) {
                if (justification.lines.length == 1
                    && branch.getProblemSentence(justification.lines[0]).sentence instanceof equalitySentence_1.EqualitySentence) {
                    branch.setErrorText("You can only use =d on an atom, an identity sentence, or negations of such");
                }
                else {
                    branch.setErrorText("The sentence whose number you cite cannot be decomposed with that rule");
                }
                return;
            }
            Decomposer.decomposeEquality(problem, branchId, justification);
            return;
        }
        if (justification.lines.length != 1) {
            branch.setErrorText("You seem to have cited multiple sentences for a rule that needs only one");
            return;
        }
        var justificationLine = justification.lines[0];
        var problemSentence = problem.getProblemSentence(branchId, justificationLine);
        if (!commonFunctions_1.isPresent(problemSentence)) {
            if (justification.decompositionRule.rule === rule_1.Rule.SM && justification.result !== "") {
                var newSentence = parser_1.parseStringToSentence(justification.result);
                branch.addProblemSentence(new problemSentence_1.ProblemSentence(nextLineNumber, newSentence, justification, branch.id));
            }
            else {
                branch.setErrorText("I did not recognize this either as a sentence or a command");
            }
            return;
        }
        if (problemSentence.checkedOff || problem.branchHasCheckedOffLine(branchId, justificationLine)) {
            branch.setErrorText(justification + ": Sentence " + justificationLine + " has already been developed!");
            return;
        }
        switch (justification.decompositionRule.rule) {
            case rule_1.Rule.negation: {
                if (justification.decompositionRule.negated) {
                    if (problemSentence.sentence.numNegated >= 2) {
                        var newSentence = problemSentence.sentence.copyWithExtraNegated(-2);
                        var checkOffNewSentence = newSentence.type === sentence_1.SentenceType.simpleSentence &&
                            newSentence.numNegated <= 1;
                        branch.addProblemSentence(new problemSentence_1.ProblemSentence(nextLineNumber, newSentence, justification, branch.id));
                        if (checkOffNewSentence) {
                            branch.addCheckedOffLine(nextLineNumber);
                        }
                    }
                    else {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                }
                else {
                    branch.setErrorText(justification + ": Expected a second logical operative.");
                    return;
                }
                branch.addCheckedOffLine(justificationLine);
                problem.checkOff(branchId, problemSentence);
                return;
            }
            case rule_1.Rule.conjunction: {
                if (problemSentence.sentence.type !== sentence_1.SentenceType.compoundSentence ||
                    problemSentence.sentence.operator !== operator_1.Operator.conjunction) {
                    branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                    return;
                }
                var left = problemSentence.sentence.children[0];
                var right = problemSentence.sentence.children[1];
                if (justification.decompositionRule.negated) {
                    if (problemSentence.sentence.numNegated !== 1) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    problem.addChildBranch(branchId, [
                        new problemSentence_1.ProblemSentence(nextLineNumber, left.copyWithExtraNegated(1), justification, branchId + 1)
                    ]);
                    problem.addChildBranch(branchId, [
                        new problemSentence_1.ProblemSentence(nextLineNumber, right.copyWithExtraNegated(1), justification, branchId + 2)
                    ]);
                }
                else {
                    if (problemSentence.sentence.numNegated !== 0) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    branch.addProblemSentence(new problemSentence_1.ProblemSentence(nextLineNumber, left.copy(), justification, branch.id));
                    branch.addProblemSentence(new problemSentence_1.ProblemSentence(nextLineNumber + 1, right.copy(), justification, branch.id));
                }
                branch.addCheckedOffLine(justificationLine);
                problem.checkOff(branchId, problemSentence);
                return;
            }
            case rule_1.Rule.disjunction: {
                if (problemSentence.sentence.type !== sentence_1.SentenceType.compoundSentence ||
                    problemSentence.sentence.operator !== operator_1.Operator.disjunction) {
                    branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                    return;
                }
                var left = problemSentence.sentence.children[0];
                var right = problemSentence.sentence.children[1];
                if (justification.decompositionRule.negated) {
                    if (problemSentence.sentence.numNegated !== 1) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    branch.addProblemSentence(new problemSentence_1.ProblemSentence(nextLineNumber, left.copyWithExtraNegated(1), justification, branch.id));
                    branch.addProblemSentence(new problemSentence_1.ProblemSentence(nextLineNumber + 1, right.copyWithExtraNegated(1), justification, branch.id));
                }
                else {
                    if (problemSentence.sentence.numNegated !== 0) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    problem.addChildBranch(branchId, [
                        new problemSentence_1.ProblemSentence(nextLineNumber, left.copy(), justification, branchId + 1)
                    ]);
                    problem.addChildBranch(branchId, [
                        new problemSentence_1.ProblemSentence(nextLineNumber, right.copy(), justification, branchId + 2)
                    ]);
                }
                branch.addCheckedOffLine(justificationLine);
                problem.checkOff(branchId, problemSentence);
                return;
            }
            case rule_1.Rule.conditional: {
                if (problemSentence.sentence.type !== sentence_1.SentenceType.compoundSentence ||
                    problemSentence.sentence.operator !== operator_1.Operator.conditional) {
                    branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                    return;
                }
                var left = problemSentence.sentence.children[0];
                var right = problemSentence.sentence.children[1];
                if (justification.decompositionRule.negated) {
                    if (problemSentence.sentence.numNegated !== 1) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    branch.addProblemSentence(new problemSentence_1.ProblemSentence(nextLineNumber, left.copy(), justification, branch.id));
                    branch.addProblemSentence(new problemSentence_1.ProblemSentence(nextLineNumber + 1, right.copyWithExtraNegated(1), justification, branch.id));
                }
                else {
                    if (problemSentence.sentence.numNegated !== 0) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    problem.addChildBranch(branchId, [
                        new problemSentence_1.ProblemSentence(nextLineNumber, left.copyWithExtraNegated(1), justification, branchId + 1)
                    ]);
                    problem.addChildBranch(branchId, [
                        new problemSentence_1.ProblemSentence(nextLineNumber, right.copy(), justification, branchId + 2)
                    ]);
                }
                branch.addCheckedOffLine(justificationLine);
                problem.checkOff(branchId, problemSentence);
                return;
            }
            case rule_1.Rule.biconditional: {
                if (problemSentence.sentence.type !== sentence_1.SentenceType.compoundSentence ||
                    problemSentence.sentence.operator !== operator_1.Operator.biconditional) {
                    branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                    return;
                }
                var left = problemSentence.sentence.children[0];
                var right = problemSentence.sentence.children[1];
                if (justification.decompositionRule.negated) {
                    if (problemSentence.sentence.numNegated !== 1) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    problem.addChildBranch(branchId, [
                        new problemSentence_1.ProblemSentence(nextLineNumber, left.copy(), justification, branchId + 1),
                        new problemSentence_1.ProblemSentence(nextLineNumber + 1, right.copyWithExtraNegated(1), justification, branchId + 2)
                    ]);
                    problem.addChildBranch(branchId, [
                        new problemSentence_1.ProblemSentence(nextLineNumber, left.copyWithExtraNegated(1), justification, branchId + 1),
                        new problemSentence_1.ProblemSentence(nextLineNumber + 1, right.copy(), justification, branchId + 2)
                    ]);
                }
                else {
                    if (problemSentence.sentence.numNegated !== 0) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    problem.addChildBranch(branchId, [
                        new problemSentence_1.ProblemSentence(nextLineNumber, left.copy(), justification, branchId + 1),
                        new problemSentence_1.ProblemSentence(nextLineNumber + 1, right.copy(), justification, branchId + 2)
                    ]);
                    problem.addChildBranch(branchId, [
                        new problemSentence_1.ProblemSentence(nextLineNumber, left.copyWithExtraNegated(1), justification, branchId + 1),
                        new problemSentence_1.ProblemSentence(nextLineNumber + 1, right.copyWithExtraNegated(1), justification, branchId + 2)
                    ]);
                }
                branch.addCheckedOffLine(justificationLine);
                problem.checkOff(branchId, problemSentence);
                return;
            }
            case rule_1.Rule.universal: {
                if (problemSentence.sentence.type !== sentence_1.SentenceType.quantifiedSentence ||
                    problemSentence.sentence.quantifier !== quantifier_1.Quantifier.universal) {
                    branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                    return;
                }
                if (justification.decompositionRule.negated) {
                    if (problemSentence.sentence.numNegated !== 1) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    var newSentence = problemSentence.sentence.copyWithExtraNegatedChild(-1);
                    newSentence.setQuantifier(quantifier_1.Quantifier.existential);
                    branch.addProblemSentence(new problemSentence_1.ProblemSentence(nextLineNumber, newSentence, justification, branch.id));
                    branch.addCheckedOffLine(justificationLine);
                    problem.checkOff(branchId, problemSentence);
                }
                else {
                    if (problemSentence.sentence.numNegated !== 0) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    var constant = prompt("Constant?");
                    var constantRegex = new RegExp("^[a-u]$");
                    if (constantRegex.test(constant)) {
                        var freeVariable = problemSentence.sentence.quantifierValue;
                        var newSentence = problemSentence.sentence.children[0].copy();
                        newSentence.replaceFreeVariables(freeVariable, constant);
                        branch.addProblemSentence(new problemSentence_1.ProblemSentence(nextLineNumber, newSentence, justification, branch.id));
                        problem.addFreeVarSubstitution(branchId, justificationLine, freeVariable, constant);
                    }
                    else {
                        branch.setErrorText(justification +
                            ": Expected a singular term for the constant - not \"" + constant + "\".");
                        return;
                    }
                }
                return;
            }
            case rule_1.Rule.existential: {
                if (problemSentence.sentence.type !== sentence_1.SentenceType.quantifiedSentence ||
                    problemSentence.sentence.quantifier !== quantifier_1.Quantifier.existential) {
                    branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                    return;
                }
                if (justification.decompositionRule.negated) {
                    if (problemSentence.sentence.numNegated !== 1) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    var newSentence = problemSentence.sentence.copyWithExtraNegatedChild(-1);
                    newSentence.setQuantifier(quantifier_1.Quantifier.universal);
                    branch.addProblemSentence(new problemSentence_1.ProblemSentence(nextLineNumber, newSentence, justification, branch.id));
                }
                else {
                    if (problemSentence.sentence.numNegated !== 0) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    var constant = prompt("Constant?");
                    var constantRegex = new RegExp("^[a-u]$");
                    if (constantRegex.test(constant)) {
                        if (problem.getBranchVariables(branchId).has(constant)) {
                            branch.setErrorText(justification +
                                ": You need a constant new to the branch - not \"" + constant + "\".");
                            return;
                        }
                        var newSentence = problemSentence.sentence.children[0].copy();
                        newSentence.replaceFreeVariables(problemSentence.sentence.quantifierValue, constant);
                        branch.addProblemSentence(new problemSentence_1.ProblemSentence(nextLineNumber, newSentence, justification, branch.id));
                    }
                    else {
                        branch.setErrorText(justification +
                            ": Expected a singular term for the constant - not \"" + constant + "\".");
                        return;
                    }
                }
                branch.addCheckedOffLine(justificationLine);
                problem.checkOff(branchId, problemSentence);
                return;
            }
        }
    };
    Decomposer.decomposeEquality = function (problem, branchId, justification) {
        var branch = problem.getBranchFromId(branchId);
        var nextLineNumber = branch.largestLineNumber() + 1;
        var leftProblemSentence = problem.getProblemSentence(branchId, justification.lines[0]);
        var rightProblemSentence = problem.getProblemSentence(branchId, justification.lines[1]);
        var leftEquality = leftProblemSentence.sentence instanceof equalitySentence_1.EqualitySentence;
        var rightEquality = rightProblemSentence.sentence instanceof equalitySentence_1.EqualitySentence;
        if (leftEquality && rightEquality) {
            var leftEqualitySentence = leftProblemSentence.sentence;
            var rightEqualitySentence = rightProblemSentence.sentence;
            var leftLeft = sentence_1.negatedToString(leftEqualitySentence.numNegated) + leftEqualitySentence.left;
            var leftRight = leftEqualitySentence.right;
            var rightLeft = sentence_1.negatedToString(rightEqualitySentence.numNegated) + rightEqualitySentence.left;
            var rightRight = rightEqualitySentence.right;
            if ((leftRight == rightLeft && rightRight == leftLeft) || leftRight == rightRight) {
                if (leftRight == rightRight) {
                    if (leftEqualitySentence.numNegated > 0 && rightEqualitySentence.numNegated > 0) {
                        branch.setErrorText("The sentence whose number you cite cannot be decomposed with that rule");
                        return;
                    }
                    else if (rightEqualitySentence.numNegated != 0 || leftEqualitySentence.numNegated != 0) {
                        var newSentence_1;
                        if (rightEqualitySentence.numNegated != 0) {
                            newSentence_1 = rightEqualitySentence.copy();
                            newSentence_1.right = leftLeft;
                        }
                        else if (leftEqualitySentence.numNegated != 0) {
                            newSentence_1 = leftEqualitySentence.copy();
                            newSentence_1.right = rightLeft;
                        }
                        branch.addProblemSentence(new problemSentence_1.ProblemSentence(nextLineNumber, newSentence_1, justification, branchId));
                        return;
                    }
                }
                // check user submitted result, if not:
                branch.setErrorText("Sorry, at least two different results are possible. Type the one you want");
                return;
            }
            else if (leftRight != rightLeft && leftRight != rightRight && rightRight != leftLeft) {
                branch.setErrorText("The sentence whose number you cite cannot be decomposed with that rule");
                return;
            }
            var newSentence_2;
            if (leftRight == rightLeft) {
                newSentence_2 = rightEqualitySentence.copy();
                newSentence_2.left = leftLeft;
            }
            else if (rightRight == leftLeft) {
                newSentence_2 = leftEqualitySentence.copy();
                newSentence_2.left = rightLeft;
            }
            branch.addProblemSentence(new problemSentence_1.ProblemSentence(nextLineNumber, newSentence_2, justification, branchId));
            return;
        }
        else if (!leftEquality && !rightEquality) {
            branch.setErrorText("The sentence whose number you cite cannot be decomposed with that rule");
            return;
        }
        else if (rightEquality) {
            // set left sentence to be the equality sentence
            var tempSentence = leftProblemSentence;
            leftProblemSentence = rightProblemSentence;
            rightProblemSentence = tempSentence;
        }
        var newSentence = rightProblemSentence.sentence.copy();
        var equalitySentence = leftProblemSentence.sentence;
        if (equalitySentence.numNegated > 1) {
            branch.setErrorText("The sentence whose number you cite cannot be decomposed with that rule");
            return;
        }
        if (!newSentence.variables.has(equalitySentence.right)) {
            branch.setErrorText("I do not find the RIGHT term from an identity in the other sentence");
            return;
        }
        newSentence.replaceFreeVariables(equalitySentence.right, equalitySentence.left);
        branch.addProblemSentence(new problemSentence_1.ProblemSentence(nextLineNumber, newSentence, justification, branchId));
    };
    return Decomposer;
}());
exports.Decomposer = Decomposer;
//# sourceMappingURL=decomposer.js.map