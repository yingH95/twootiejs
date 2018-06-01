import {Sentence, SentenceType} from "./sentence";
import {Justification} from "./justification";

export class ProblemSentence {
    private _checkedOff: boolean = false;
    private _freeVarsSubstitutionMap: Map<string, Set<string>> = new Map<string, Set<string>>();

    constructor(
        private _lineNumber: number,
        private _sentence: Sentence,
        private _justification: Justification,
        private _branchId: number
    ) {
        if (this._sentence.type === SentenceType.simpleSentence &&
            this._sentence.numNegated <= 1) {
            this._checkedOff = true;
        }
    }
    public get branchId(): number {
        return this._branchId;
    }

    public get lineNumber(): number {
        return this._lineNumber;
    }

    public get sentence(): Sentence {
        return this._sentence;
    }

    public get justification(): string {
        return this._justification.toString();
    }

    public get checkedOff(): boolean {
        return this._checkedOff;
    }

    public setCheckedOff(checkedOff: boolean): void {
        this._checkedOff = checkedOff;
    }

    public get freeVarsSubstitutionMap(): Map<string, Set<string>> {
        return this._freeVarsSubstitutionMap;
    }

    public addFreeVarSubstitution(freeVar: string, substitution: string): void {
        if (this._freeVarsSubstitutionMap.has(freeVar)) {
            this._freeVarsSubstitutionMap.get(freeVar).add(substitution);
        } else {
            this._freeVarsSubstitutionMap.set(freeVar, new Set<string>(substitution));
        }
    }

    public copy(): ProblemSentence {
        return new ProblemSentence(
            this._lineNumber,
            this._sentence,
            this._justification,
            this._branchId
        )
    }
}
