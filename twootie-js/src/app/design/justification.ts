import {DecompositionRule, Rule} from "./rule";

export class Justification {
    constructor(
        private _lines: Array<number>,
        private _decompositionRule: DecompositionRule,
        private _result: string = ""
    ) {}

    public get result(): string {
        return this._result;
    }

    public get lines(): Array<number> {
        return this._lines;
    }

    public get decompositionRule(): DecompositionRule {
        return this._decompositionRule;
    }

    public toString(): string {
        if (this._decompositionRule.rule === Rule.SM) {
            return this._decompositionRule.toString();
        }
        return this._lines + " " + this._decompositionRule.toString();
    }
}
