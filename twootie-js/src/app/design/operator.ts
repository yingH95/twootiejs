export enum Operator {
    conjunction, disjunction, conditional, biconditional, equality
}

export function operatorToString(operator: Operator): string {
    switch(operator) {
        case Operator.conjunction:
            return "&";
        case Operator.disjunction:
            return "v";
        case Operator.conditional:
            return "→";
        case Operator.biconditional:
            return "≡";
        case Operator.equality:
            return "="
    }
}

export function stringToOperator(str: string): Operator {
    switch(str) {
        case "&":
            return Operator.conjunction;
        case "v":
            return Operator.disjunction;
        case ">":
        case "→":
            return Operator.conditional;
        case "≡":
        case "<":
            return Operator.biconditional;
        case "=":
            return Operator.equality;
    }
}
