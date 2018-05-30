import {mergeSets} from "../util/commonFunctions";
export enum SentenceType {
    simpleSentence, compoundSentence, quantifiedSentence, equalitySentence
}

export abstract class Sentence {
    constructor (
        protected _numNegated: number,
        protected _type: SentenceType
    ) {
    }

    public get numNegated(): number {
        return this._numNegated;
    }

    public setNumNegated(numNegated: number): void {
        this._numNegated = numNegated;
    }

    public get type(): SentenceType {
        return this._type;
    }

    public get variables(): Set<string> {
        return mergeSets(this.children.map(child => child.variables));
    }

    public abstract get children(): Array<Sentence>;

    public get hasChildren(): boolean {
        return this.children.length > 0;
    }

    public replaceFreeVariables(freeVar: string, constant: string): void {
        this.children.forEach(child => child.replaceFreeVariables(freeVar, constant));
    }

    public abstract toString(): string;

    public abstract copy(): Sentence;

    public abstract copyWithExtraNegated(extraNegated: number): Sentence;
}

export function negatedToString(numNegated: number): string {
    return "¬".repeat(numNegated);
}
