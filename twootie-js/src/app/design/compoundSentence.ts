import {Sentence, SentenceType, negatedToString} from "./sentence";
import {Operator, operatorToString} from "./operator";

export class CompoundSentenceChildren {
    constructor(
        private _left: Sentence,
        private _right: Sentence
    ) {}

    public get left(): Sentence {
        return this._left;
    }

    public get right(): Sentence {
        return this._right;
    }
}

export class CompoundSentence extends Sentence {
    constructor(
        numNegated: number,
        protected _operator: Operator,
        protected _children: CompoundSentenceChildren
    ) {
        super(numNegated, SentenceType.compoundSentence);
    }

    public get operator(): Operator {
        return this._operator;
    }

    public get children(): Array<Sentence> {
        return [this._children.left, this._children.right];
    }

    public toString(): string {
        let shouldLeftBracket: boolean = this._children.left.type === SentenceType.compoundSentence &&
            this._children.left.numNegated === 0;
        let shouldRightBracket: boolean = this._children.right.type === SentenceType.compoundSentence &&
            this._children.right.numNegated === 0;

        let left: string = this._children.left.toString();
        let right: string = this._children.right.toString();
        if (shouldLeftBracket) {
            left = "(" + left + ")";
        }
        if (shouldRightBracket) {
            right = "(" + right + ")";
        }

        let result: string = left + " " + operatorToString(this._operator) + " " + right;
        if (this._numNegated > 0) {
            result = negatedToString(this._numNegated) + "( " + result + " )";
        }

        return result;
    }

    public copy(): CompoundSentence {
        return new CompoundSentence(
            this._numNegated,
            this._operator,
            new CompoundSentenceChildren(
                this._children.left.copy(),
                this._children.right.copy()
            )
        );
    }

    public copyWithExtraNegated(extraNegated: number): CompoundSentence {
        return new CompoundSentence(
            this._numNegated + extraNegated,
            this._operator,
            new CompoundSentenceChildren(
                this._children.left.copy(),
                this._children.right.copy()
            )
        );
    }
}
