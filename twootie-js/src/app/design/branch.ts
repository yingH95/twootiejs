import {ProblemSentence} from "./problemSentence";
import {mergeSets, isPresent, removeFromSet} from "../util/commonFunctions";
import {FREE_VARS} from "../util/parser";

export class Branch {
    private _sentenceLineNumbers: Map<number, ProblemSentence> = new Map<number, ProblemSentence>();
    private _checkedOffLines: Set<number> = new Set<number>();
    private _errorText: string = "";

    constructor(
        private _id: number,
        private _parentId: number,
        private _problemSentences: Array<ProblemSentence>,
        private _closed: boolean = false
    ) {
        for (let i: number = 0; i < this._problemSentences.length; i++) {
            let curProblemSentence: ProblemSentence = this._problemSentences[i];
            if (this._sentenceLineNumbers.has(curProblemSentence.lineNumber)) {
                // throw error here
            } else {
                this._sentenceLineNumbers.set(curProblemSentence.lineNumber, curProblemSentence);
            }
        }
    }

    public get id(): number {
        return this._id;
    }

    public get parentId(): number {
        return this._parentId;
    }

    public get problemSentences(): Array<ProblemSentence> {
        return this._problemSentences;
    }

    public getProblemSentence(lineNumber: number): ProblemSentence {
        return this._sentenceLineNumbers.get(lineNumber);
    }

    public setProblemSentences(problemSentences: Array<ProblemSentence>): void {
        this._problemSentences = problemSentences;
    }

    public addProblemSentence(problemSentence: ProblemSentence): void {
        if (this._sentenceLineNumbers.has(problemSentence.lineNumber)) {
            // throw error
        } else {
            this._problemSentences.push(problemSentence);
            this._sentenceLineNumbers.set(problemSentence.lineNumber, problemSentence);
        }
    }

    public hasLine(line: number): boolean {
        return this._sentenceLineNumbers.has(line);
    }

    public get closed(): boolean {
        return this._closed;
    }

    public setClosed(closed: boolean) {
        this._closed = closed;
    }

    public get checkedOffLines(): Set<number> {
        return this._checkedOffLines;
    }

    public addCheckedOffLine(line: number): void {
        this._checkedOffLines.add(line);
    }

    public get errorText(): string {
        return this._errorText;
    }

    public setErrorText(errorText: string): void {
        this._errorText = errorText;
    }

    public resetErrorText(): void {
        this.setErrorText("");
    }

    public largestLineNumber(): number {
        return Math.max.apply(Math, this._problemSentences.map(problemSentence => problemSentence.lineNumber));
    }

    public get variables(): Set<string> {
        let allVars: Set<string> = mergeSets(this.problemSentences.map(problemSentence =>
            problemSentence.sentence.variables));
        removeFromSet(allVars, FREE_VARS);
        return allVars;
    }

    public getLineFreeVarSubstitutions(freeVar: string, line: number): Set<string> {
        let problemSentence: ProblemSentence = this.getProblemSentence(line);
        if (isPresent(problemSentence)) {
            let freeVarSubstitutions: Set<string> = problemSentence.freeVarsSubstitutionMap.get(freeVar);
            if (isPresent(freeVarSubstitutions)) {
                return freeVarSubstitutions;
            }
        }
        return new Set<string>();
    }

    public addLineFreeVarSubstitution(line: number, freeVar: string, substitution: string): void {
        let problemSentence: ProblemSentence = this.getProblemSentence(line);
        if (isPresent(problemSentence)) {
            problemSentence.addFreeVarSubstitution(freeVar, substitution);
        }
    }
}
