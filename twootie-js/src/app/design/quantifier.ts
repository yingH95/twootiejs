export enum Quantifier {
    universal, existential
}

export function quantifierToString(quantifier: Quantifier): string {
    switch(quantifier) {
        case Quantifier.universal:
            return "V";
        case Quantifier.existential:
            return "]";
    }
}

export function stringToQuantifier(str: string): Quantifier {
    switch(str) {
        case "V":
            return Quantifier.universal;
        case "]":
            return Quantifier.existential;
    }
}
