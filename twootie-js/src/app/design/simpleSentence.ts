import {Sentence, SentenceType, negatedToString} from "./sentence";

export class SimpleSentence extends Sentence {
    constructor(
        numNegated: number,
        protected _value: string,
        protected _variables: Array<string> = []
    ) {
        super(numNegated, SentenceType.simpleSentence);
    }

    public get value(): string {
        return this._value;
    }

    public get variables(): Set<string> {
        return new Set(this._variables);
    }

    public get children(): Array<Sentence> {
        return [];
    }

    public replaceFreeVariables(freeVar: string, constant: string): void {
        this._variables = this._variables.join("").replace(new RegExp(freeVar, "g"), constant).split("");
    }

    public toString(): string {
        return negatedToString(this._numNegated) + this._value + this._variables.join("");
    }

    public copy(): SimpleSentence {
        return new SimpleSentence(this._numNegated, this._value, this._variables);
    }

    public copyWithExtraNegated(extraNegated: number): SimpleSentence {
        return new SimpleSentence(this._numNegated + extraNegated, this._value, this._variables);
    }

    public static createDefault(): SimpleSentence {
        return new SimpleSentence(0, "");
    }
}
