import {Sentence, SentenceType, negatedToString} from "./sentence";
import {Quantifier, quantifierToString} from "./quantifier";

export class QuantifiedSentence extends Sentence {
    constructor(
        numNegated: number,
        protected _quantifier: Quantifier,
        protected _quantifierValue: string,
        protected _childSentence: Sentence
    ) {
        super(numNegated, SentenceType.quantifiedSentence);
    }

    public get quantifier(): Quantifier {
        return this._quantifier;
    }

    public setQuantifier(quantifier: Quantifier): void {
        this._quantifier = quantifier;
    }

    public get quantifierValue(): string {
        return this._quantifierValue;
    }

    public get childSentence(): Sentence {
        return this._childSentence;
    }

    public get children(): Array<Sentence> {
        return [this._childSentence];
    }

    public toString(): string {
        let quantifierString: string = "(" + quantifierToString(this._quantifier) + this._quantifierValue + ")";
        let childString: string = this._childSentence.toString();
        if (this._childSentence.type === SentenceType.compoundSentence) {
            childString = "(" + childString + ")";
        }
        return negatedToString(this._numNegated) + quantifierString + " " + childString;
    }

    public copy(): QuantifiedSentence {
        return new QuantifiedSentence(
            this._numNegated,
            this._quantifier,
            this._quantifierValue,
            this._childSentence.copy()
        );
    }

    public copyWithExtraNegated(extraNegated: number): QuantifiedSentence {
        return new QuantifiedSentence(
            this._numNegated + extraNegated,
            this._quantifier,
            this._quantifierValue,
            this._childSentence.copy()
        );
    }

    public copyWithExtraNegatedChild(extraNegated: number): QuantifiedSentence {
        return new QuantifiedSentence(
            this._numNegated + extraNegated,
            this._quantifier,
            this._quantifierValue,
            this._childSentence.copyWithExtraNegated(1)
        );
    }
}
