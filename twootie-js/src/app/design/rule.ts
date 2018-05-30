export enum Rule {
    negation,
    conjunction,
    disjunction,
    conditional,
    biconditional,
    universal,
    existential,
    equality,
    SM
}

export class DecompositionRule {
    constructor(
        private _negated: boolean,
        private _rule: Rule
    ) {}

    public get negated(): boolean {
        return this._negated;
    }

    public get rule(): Rule {
        return this._rule;
    }

    public toString(): string {
        if (this._rule === Rule.SM) {
            return ruleToString(this._rule);
        }
        let prefix: string = "";
        if (this._negated) {
            prefix = "¬";
        }
        return prefix + ruleToString(this._rule) + "D";
    }
}

export function ruleToString(rule: Rule): string {
    switch(rule) {
        case Rule.negation:
            return "¬";
        case Rule.conjunction:
            return "&";
        case Rule.disjunction:
            return "v";
        case Rule.conditional:
            return "→";
        case Rule.biconditional:
            return "≡";
        case Rule.universal:
            return "V";
        case Rule.existential:
            return "]";
        case Rule.equality:
            return "=";
        case Rule.SM:
            return "SM";
    }
}

export function stringToDecompositionRule(str: string): DecompositionRule {
    let negated: boolean = false;
    if (/[-~¬]/g.test(str[0])) {
        negated = true;
        if (str.length === 1) {
            return new DecompositionRule(false, Rule.negation);
        }
        str = str.slice(1);
    }
    switch(str) {
        case "-":
        case "~":
        case "¬":
            return new DecompositionRule(negated, Rule.negation);
        case "&":
            return new DecompositionRule(negated, Rule.conjunction);
        case "v":
            return new DecompositionRule(negated, Rule.disjunction);
        case ">":
        case "→":
            return new DecompositionRule(negated, Rule.conditional);
        case "<":
        case "≡":
            return new DecompositionRule(negated, Rule.biconditional);
        case "V":
            return new DecompositionRule(negated, Rule.universal);
        case "]":
            return new DecompositionRule(negated, Rule.existential);
        case "=":
            return new DecompositionRule(negated, Rule.equality);
        case "SM":
            return new DecompositionRule(false, Rule.SM);
    }
}
