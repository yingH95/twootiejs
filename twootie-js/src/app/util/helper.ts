import {Problem} from "../design/problem";
import {parseStringToSentence, parseStringToJustification} from "./parser";
import {ProblemSentence} from "../design/problemSentence";
import {SimpleSentence} from "../design/simpleSentence";
import {ProblemSet} from "./problemSet";

let probSet = new ProblemSet();

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

function parseProblemSentence(newProblemObj: any): ProblemSentence[] {
    let newSentenceArr: ProblemSentence[] = [];
    if (typeof newProblemObj.sentences !== 'undefined') {
        for (let sentence of newProblemObj.sentences) {
            let s = new ProblemSentence(
                sentence.line,
                parseStringToSentence(sentence.sen),
                parseStringToJustification(sentence.just),
                sentence.br
            );
            newSentenceArr.push(s);
        }
    }
    return newSentenceArr;
}

export function createSLProblem(): Problem {
    let pid = 1;
    let newProblemObj: any = probSet.getSlProbId(pid);
    let newSentenceArr: ProblemSentence[] = parseProblemSentence(newProblemObj);
    let problem = new Problem(newSentenceArr);
    problem.setProbId(pid);
    return problem;
}

export function createPLProblem(): Problem {
    let pid = 1;
    let newProblemObj: any = probSet.getPlProbId(pid);
    let newSentenceArr: ProblemSentence[] = parseProblemSentence(newProblemObj);
    let problem = new Problem(newSentenceArr);
    problem.setProbId(pid);
    return problem;
}

export function getNextPLProblem(lastPid: number): Problem {
    let nextPid = lastPid + 1;
    let newProblemObj: any;
    if (!probSet.hasProbWithId(nextPid, "PL")){
        nextPid = 1;
    }
    newProblemObj = probSet.getPlProbId(nextPid);
    let newSentenceArr = parseProblemSentence(newProblemObj);
    let nextProb = new Problem(newSentenceArr);
    nextProb.setProbId(nextPid);
    return nextProb;
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
