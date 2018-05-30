import {Sentence, SentenceType, negatedToString} from "./sentence";
import {Operator, operatorToString} from "./operator";

export class EqualitySentence extends Sentence {
    constructor(
        numNegated: number,
        protected _left: string,
        protected _right: string
    ) {
        super(numNegated, SentenceType.equalitySentence);
    }

    public get left(): string {
        return this._left;
    }

    public set left(left: string) {
        this._left = left;
    }

    public get right(): string {
        return this._right;
    }

    public set right(right: string) {
        this._right = right;
    }

    public get children(): Array<Sentence> {
        return [];
    }

    public toString(): string {
        return negatedToString(this._numNegated) + this._left + " "
            + operatorToString(Operator.equality) + " " + this._right;
    }

    public copy(): EqualitySentence {
        return new EqualitySentence(this._numNegated, this._left, this._right);
    }

    public copyWithExtraNegated(extraNegated: number): EqualitySentence {
        return new EqualitySentence(this._numNegated + extraNegated, this._left, this._right);
    }
}
