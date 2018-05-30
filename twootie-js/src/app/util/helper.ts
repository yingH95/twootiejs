import {Problem} from "../design/problem";
import {parseStringToSentence, parseStringToJustification} from "./parser";
import {ProblemSentence} from "../design/problemSentence";
import {SimpleSentence} from "../design/simpleSentence";

export function createMockProblem(): Problem {
    return new Problem([
        /*new ProblemSentence(
            1,
            parseStringToSentence("K>-W"),
            parseStringToJustification("/SM")
        ),
        new ProblemSentence(
            2,
            parseStringToSentence("K<Q"),
            parseStringToJustification("/SM")
        ),
        new ProblemSentence(
            3,
            parseStringToSentence("(Q&-W)<-(QvW)"),
            parseStringToJustification("/SM")
        )*/
    ]);
}

export function createEmptyProblem(): Problem {
    return new Problem([]);
}

export function createSLProblem(): Problem {
    return new Problem([
        new ProblemSentence(
            1,
            parseStringToSentence("((D&K)&J)"),
            parseStringToJustification("/SM"),
            0
        ),
        new ProblemSentence(
            2,
            parseStringToSentence("(L&P)"),
            parseStringToJustification("/SM"),
            0
        ),
        new ProblemSentence(
            3,
            parseStringToSentence("-(K&L)"),
            parseStringToJustification("/SM"),
            0
        )
    ]);
}

export function createPLProblem(): Problem {
    return new Problem([
        new ProblemSentence(
            1,
            parseStringToSentence("Vx(Gxa>Lxa)"),
            parseStringToJustification("/SM"),
            0
        ),
        new ProblemSentence(
            2,
            parseStringToSentence("Gca"),
            parseStringToJustification("/SM"),
            0
        ),
        new ProblemSentence(
            3,
            parseStringToSentence("-Lca"),
            parseStringToJustification("/SM"),
            0
        )
    ]);
}

export function noSentenceConflicts(simpleSentences: Array<SimpleSentence>): boolean {
    let valueMap: Map<string, number> = new Map<string, number>();
    for (let i: number = 0; i < simpleSentences.length; i++) {
        let curSentence: SimpleSentence = simpleSentences[i];
        if (valueMap.has(curSentence.value)) {
            if ((valueMap.get(curSentence.value) - curSentence.numNegated) % 2 !== 0) {
                return false;
            }
        } else {
            valueMap.set(curSentence.value, curSentence.numNegated);
        }
    }
    return true;
}
