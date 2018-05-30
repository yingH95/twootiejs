import {Justification} from "../design/justification";
import {Problem} from "../design/problem";
import {Rule} from "../design/rule";
import {ProblemSentence} from "../design/problemSentence";
import {Branch} from "../design/branch";
import {SentenceType, Sentence, negatedToString} from "../design/sentence";
import {CompoundSentence} from "../design/compoundSentence";
import {Operator} from "../design/operator";
import {isPresent} from "./commonFunctions";
import {QuantifiedSentence} from "../design/quantifiedSentence";
import {Quantifier} from "../design/quantifier";
import {EqualitySentence} from "../design/equalitySentence";
import {parseStringToSentence} from "./parser";

export class Decomposer {
    public static decompose(problem: Problem, branchId: number, justification: Justification): void {
        let branch: Branch = problem.getBranchFromId(branchId);
        let nextLineNumber: number = branch.largestLineNumber() + 1;
        if (nextLineNumber === -Infinity) {
            nextLineNumber = 1;
        }
        if (justification.decompositionRule.rule == Rule.equality) {
            if (justification.decompositionRule.negated) {
                branch.setErrorText("There is no negated identity decomposition rule");
                return;
            }
            if (justification.lines.length != 2) {
                if (justification.lines.length == 1
                    && branch.getProblemSentence(justification.lines[0]).sentence instanceof EqualitySentence) {
                    branch.setErrorText("You can only use =d on an atom, an identity sentence, or negations of such");
                } else {
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
        let justificationLine: number = justification.lines[0];
        let problemSentence: ProblemSentence = problem.getProblemSentence(branchId, justificationLine);
        if (!isPresent(problemSentence)) {
            if (justification.decompositionRule.rule === Rule.SM && justification.result !== "") {
                let newSentence: Sentence = parseStringToSentence(justification.result);
                branch.addProblemSentence(
                    new ProblemSentence(
                        nextLineNumber,
                        newSentence,
                        justification,
                        branch.id
                    )
                );
            } else {
                branch.setErrorText("I did not recognize this either as a sentence or a command");
            }
            return;
        }
        if (problemSentence.checkedOff || problem.branchHasCheckedOffLine(branchId, justificationLine)) {
            branch.setErrorText(justification + ": Sentence " + justificationLine + " has already been developed!");
            return;
        }
        switch (justification.decompositionRule.rule) {
            case Rule.negation: {
                if (justification.decompositionRule.negated) {
                    if (problemSentence.sentence.numNegated >= 2) {
                        let newSentence: Sentence = problemSentence.sentence.copyWithExtraNegated(-2);
                        let checkOffNewSentence: boolean = newSentence.type === SentenceType.simpleSentence &&
                            newSentence.numNegated <= 1;
                        branch.addProblemSentence(
                            new ProblemSentence(
                                nextLineNumber,
                                newSentence,
                                justification,
                                branch.id
                            )
                        );
                        if (checkOffNewSentence) {
                            branch.addCheckedOffLine(nextLineNumber);
                        }
                    } else {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                } else {
                    branch.setErrorText(justification + ": Expected a second logical operative.");
                    return;
                }
                branch.addCheckedOffLine(justificationLine);
                problem.checkOff(branchId, problemSentence);
                return;
            }
            case Rule.conjunction: {
                if (problemSentence.sentence.type !== SentenceType.compoundSentence ||
                    (<CompoundSentence> problemSentence.sentence).operator !== Operator.conjunction) {
                    branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                    return;
                }
                let left: Sentence = problemSentence.sentence.children[0];
                let right: Sentence = problemSentence.sentence.children[1];

                if (justification.decompositionRule.negated) {
                    if (problemSentence.sentence.numNegated !== 1) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    problem.addChildBranch(
                        branchId,
                        [
                            new ProblemSentence(
                                nextLineNumber,
                                left.copyWithExtraNegated(1),
                                justification,
                                branchId + 1
                            )
                        ]
                    );
                    problem.addChildBranch(
                        branchId,
                        [
                            new ProblemSentence(
                                nextLineNumber,
                                right.copyWithExtraNegated(1),
                                justification,
                                branchId + 2
                            )
                        ]
                    );
                } else {
                    if (problemSentence.sentence.numNegated !== 0) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    branch.addProblemSentence(
                        new ProblemSentence(
                            nextLineNumber,
                            left.copy(),
                            justification,
                            branch.id
                        )
                    );
                    branch.addProblemSentence(
                        new ProblemSentence(
                            nextLineNumber + 1,
                            right.copy(),
                            justification,
                            branch.id
                        )
                    );
                }
                branch.addCheckedOffLine(justificationLine);
                problem.checkOff(branchId, problemSentence);
                return;
            }
            case Rule.disjunction: {
                if (problemSentence.sentence.type !== SentenceType.compoundSentence ||
                    (<CompoundSentence> problemSentence.sentence).operator !== Operator.disjunction) {
                    branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                    return;
                }
                let left: Sentence = problemSentence.sentence.children[0];
                let right: Sentence = problemSentence.sentence.children[1];

                if (justification.decompositionRule.negated) {
                    if (problemSentence.sentence.numNegated !== 1) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    branch.addProblemSentence(
                        new ProblemSentence(
                            nextLineNumber,
                            left.copyWithExtraNegated(1),
                            justification,
                            branch.id
                        )
                    );
                    branch.addProblemSentence(
                        new ProblemSentence(
                            nextLineNumber + 1,
                            right.copyWithExtraNegated(1),
                            justification,
                            branch.id
                        )
                    );
                } else {
                    if (problemSentence.sentence.numNegated !== 0) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    problem.addChildBranch(
                        branchId,
                        [
                            new ProblemSentence(
                                nextLineNumber,
                                left.copy(),
                                justification,
                                branchId + 1
                            )
                        ]
                    );
                    problem.addChildBranch(
                        branchId,
                        [
                            new ProblemSentence(
                                nextLineNumber,
                                right.copy(),
                                justification,
                                branchId + 2
                            )
                        ]
                    );
                }
                branch.addCheckedOffLine(justificationLine);
                problem.checkOff(branchId, problemSentence);
                return;
            }
            case Rule.conditional: {
                if (problemSentence.sentence.type !== SentenceType.compoundSentence ||
                    (<CompoundSentence> problemSentence.sentence).operator !== Operator.conditional) {
                    branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                    return;
                }
                let left: Sentence = problemSentence.sentence.children[0];
                let right: Sentence = problemSentence.sentence.children[1];

                if (justification.decompositionRule.negated) {
                    if (problemSentence.sentence.numNegated !== 1) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    branch.addProblemSentence(
                        new ProblemSentence(
                            nextLineNumber,
                            left.copy(),
                            justification,
                            branch.id
                        )
                    );
                    branch.addProblemSentence(
                        new ProblemSentence(
                            nextLineNumber + 1,
                            right.copyWithExtraNegated(1),
                            justification,
                            branch.id
                        )
                    );
                } else {
                    if (problemSentence.sentence.numNegated !== 0) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    problem.addChildBranch(
                        branchId,
                        [
                            new ProblemSentence(
                                nextLineNumber,
                                left.copyWithExtraNegated(1),
                                justification,
                                branchId + 1
                            )
                        ]
                    );
                    problem.addChildBranch(
                        branchId,
                        [
                            new ProblemSentence(
                                nextLineNumber,
                                right.copy(),
                                justification,
                                branchId + 2
                            )
                        ]
                    );
                }
                branch.addCheckedOffLine(justificationLine);
                problem.checkOff(branchId, problemSentence);
                return;
            }
            case Rule.biconditional: {
                if (problemSentence.sentence.type !== SentenceType.compoundSentence ||
                    (<CompoundSentence> problemSentence.sentence).operator !== Operator.biconditional) {
                    branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                    return;
                }
                let left: Sentence = problemSentence.sentence.children[0];
                let right: Sentence = problemSentence.sentence.children[1];

                if (justification.decompositionRule.negated) {
                    if (problemSentence.sentence.numNegated !== 1) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    problem.addChildBranch(
                        branchId,
                        [
                            new ProblemSentence(
                                nextLineNumber,
                                left.copy(),
                                justification,
                                branchId + 1
                            ),
                            new ProblemSentence(
                                nextLineNumber + 1,
                                right.copyWithExtraNegated(1),
                                justification,
                                branchId + 2
                            )
                        ]
                    );
                    problem.addChildBranch(
                        branchId,
                        [
                            new ProblemSentence(
                                nextLineNumber,
                                left.copyWithExtraNegated(1),
                                justification,
                                branchId + 1
                            ),
                            new ProblemSentence(
                                nextLineNumber + 1,
                                right.copy(),
                                justification,
                                branchId + 2
                            )
                        ]
                    );
                } else {
                    if (problemSentence.sentence.numNegated !== 0) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    problem.addChildBranch(
                        branchId,
                        [
                            new ProblemSentence(
                                nextLineNumber,
                                left.copy(),
                                justification,
                                branchId + 1
                            ),
                            new ProblemSentence(
                                nextLineNumber + 1,
                                right.copy(),
                                justification,
                                branchId + 2
                            )
                        ]
                    );
                    problem.addChildBranch(
                        branchId,
                        [
                            new ProblemSentence(
                                nextLineNumber,
                                left.copyWithExtraNegated(1),
                                justification,
                                branchId + 1
                            ),
                            new ProblemSentence(
                                nextLineNumber + 1,
                                right.copyWithExtraNegated(1),
                                justification,
                                branchId + 2
                            )
                        ]
                    );
                }
                branch.addCheckedOffLine(justificationLine);
                problem.checkOff(branchId, problemSentence);
                return;
            }
            case Rule.universal: {
                if (problemSentence.sentence.type !== SentenceType.quantifiedSentence ||
                    (<QuantifiedSentence> problemSentence.sentence).quantifier !== Quantifier.universal) {
                    branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                    return;
                }

                if (justification.decompositionRule.negated) {
                    if (problemSentence.sentence.numNegated !== 1) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    let newSentence: QuantifiedSentence =
                        (<QuantifiedSentence> <QuantifiedSentence> problemSentence.sentence).copyWithExtraNegatedChild(-1);
                    newSentence.setQuantifier(Quantifier.existential);
                    branch.addProblemSentence(
                        new ProblemSentence(
                            nextLineNumber,
                            newSentence,
                            justification,
                            branch.id
                        )
                    );
                    branch.addCheckedOffLine(justificationLine);
                    problem.checkOff(branchId, problemSentence);
                } else {
                    if (problemSentence.sentence.numNegated !== 0) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    let constant: string = prompt("Constant?");
                    let constantRegex: RegExp = new RegExp("^[a-u]$");
                    if (constantRegex.test(constant)) {
                        let freeVariable: string = (<QuantifiedSentence> problemSentence.sentence).quantifierValue;
                        let newSentence: Sentence = problemSentence.sentence.children[0].copy();
                        newSentence.replaceFreeVariables(
                            freeVariable,
                            constant
                        );
                        branch.addProblemSentence(
                            new ProblemSentence(
                                nextLineNumber,
                                newSentence,
                                justification,
                                branch.id
                            )
                        );
                        problem.addFreeVarSubstitution(branchId, justificationLine, freeVariable, constant);
                    } else {
                        branch.setErrorText(justification +
                            ": Expected a singular term for the constant - not \"" + constant + "\".");
                        return;
                    }
                }
                return;
            }
            case Rule.existential: {
                if (problemSentence.sentence.type !== SentenceType.quantifiedSentence ||
                    (<QuantifiedSentence> problemSentence.sentence).quantifier !== Quantifier.existential) {
                    branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                    return;
                }

                if (justification.decompositionRule.negated) {
                    if (problemSentence.sentence.numNegated !== 1) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    let newSentence: QuantifiedSentence =
                        (<QuantifiedSentence> <QuantifiedSentence> problemSentence.sentence).copyWithExtraNegatedChild(-1);
                    newSentence.setQuantifier(Quantifier.universal);
                    branch.addProblemSentence(
                        new ProblemSentence(
                            nextLineNumber,
                            newSentence,
                            justification,
                            branch.id
                        )
                    );
                } else {
                    if (problemSentence.sentence.numNegated !== 0) {
                        branch.setErrorText(justification + ": This sentence cannot be decomposed with that rule.");
                        return;
                    }
                    let constant: string = prompt("Constant?");
                    let constantRegex: RegExp = new RegExp("^[a-u]$");
                    if (constantRegex.test(constant)) {
                        if (problem.getBranchVariables(branchId).has(constant)) {
                            branch.setErrorText(justification +
                                ": You need a constant new to the branch - not \"" + constant + "\".");
                            return;
                        }
                        let newSentence: Sentence = problemSentence.sentence.children[0].copy();
                        newSentence.replaceFreeVariables(
                            (<QuantifiedSentence> problemSentence.sentence).quantifierValue,
                            constant
                        );
                        branch.addProblemSentence(
                            new ProblemSentence(
                                nextLineNumber,
                                newSentence,
                                justification,
                                branch.id
                            )
                        );
                    } else {
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
    }

    public static decomposeEquality(problem: Problem, branchId: number, justification: Justification): void {
        let branch: Branch = problem.getBranchFromId(branchId);
        let nextLineNumber: number = branch.largestLineNumber() + 1;
        let leftProblemSentence: ProblemSentence = problem.getProblemSentence(branchId, justification.lines[0]);
        let rightProblemSentence: ProblemSentence = problem.getProblemSentence(branchId, justification.lines[1]);
        let leftEquality: boolean = leftProblemSentence.sentence instanceof EqualitySentence;
        let rightEquality: boolean = rightProblemSentence.sentence instanceof EqualitySentence;

        if (leftEquality && rightEquality) {
            let leftEqualitySentence: EqualitySentence = <EqualitySentence> leftProblemSentence.sentence;
            let rightEqualitySentence: EqualitySentence = <EqualitySentence> rightProblemSentence.sentence;
            let leftLeft: string = negatedToString(leftEqualitySentence.numNegated) + leftEqualitySentence.left;
            let leftRight: string = leftEqualitySentence.right;
            let rightLeft: string = negatedToString(rightEqualitySentence.numNegated) + rightEqualitySentence.left;
            let rightRight: string = rightEqualitySentence.right;

            if ((leftRight == rightLeft && rightRight == leftLeft) || leftRight == rightRight) {
                if (leftRight == rightRight) {
                    if (leftEqualitySentence.numNegated > 0 && rightEqualitySentence.numNegated > 0) {
                        branch.setErrorText("The sentence whose number you cite cannot be decomposed with that rule");
                        return;
                    } else if (rightEqualitySentence.numNegated != 0 || leftEqualitySentence.numNegated != 0) {
                        let newSentence: EqualitySentence;
                        if (rightEqualitySentence.numNegated != 0) {
                            newSentence = rightEqualitySentence.copy();
                            newSentence.right = leftLeft;
                        } else if (leftEqualitySentence.numNegated != 0) {
                            newSentence = leftEqualitySentence.copy();
                            newSentence.right = rightLeft;
                        }
                        branch.addProblemSentence(
                            new ProblemSentence(
                                nextLineNumber,
                                newSentence,
                                justification,
                                branchId
                            )
                        );
                        return;
                    }
                }
                // check user submitted result, if not:
                branch.setErrorText("Sorry, at least two different results are possible. Type the one you want");
                return;
            } else if (leftRight != rightLeft && leftRight != rightRight && rightRight != leftLeft) {
                branch.setErrorText("The sentence whose number you cite cannot be decomposed with that rule");
                return;
            }
            let newSentence: EqualitySentence;
            if (leftRight == rightLeft) {
                newSentence = rightEqualitySentence.copy();
                newSentence.left = leftLeft;
            } else if (rightRight == leftLeft) {
                newSentence = leftEqualitySentence.copy();
                newSentence.left = rightLeft;
            }
            branch.addProblemSentence(
                new ProblemSentence(
                    nextLineNumber,
                    newSentence,
                    justification,
                    branchId
                )
            );
            return;
        } else if (!leftEquality && !rightEquality) {
            branch.setErrorText("The sentence whose number you cite cannot be decomposed with that rule");
            return;
        } else if (rightEquality) {
            // set left sentence to be the equality sentence
            let tempSentence: ProblemSentence = leftProblemSentence;
            leftProblemSentence = rightProblemSentence;
            rightProblemSentence = tempSentence;
        }
        let newSentence: Sentence = rightProblemSentence.sentence.copy();
        let equalitySentence: EqualitySentence = <EqualitySentence> leftProblemSentence.sentence;
        if (equalitySentence.numNegated > 1) {
            branch.setErrorText("The sentence whose number you cite cannot be decomposed with that rule");
            return;
        }
        if (!newSentence.variables.has(equalitySentence.right)) {
            branch.setErrorText("I do not find the RIGHT term from an identity in the other sentence");
            return;
        }
        newSentence.replaceFreeVariables(
            equalitySentence.right,
            equalitySentence.left
        );
        branch.addProblemSentence(
            new ProblemSentence(
                nextLineNumber,
                newSentence,
                justification,
                branchId
            )
        );
    }
}
