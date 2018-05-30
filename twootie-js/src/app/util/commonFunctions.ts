export function isPresent(obj: any): boolean {
    return obj !== undefined && obj !== null;
}

export function stripBrackets(str: string): string {
    if (str[0] === "(" && str[str.length - 1] === ")") {
        let curBrackets: number = 1;
        for (let i: number = 1; i < str.length - 1; i++) {
            if (str[i] === "(") {
                curBrackets++;
            } else if (str[i] === ")") {
                curBrackets--;
            }
            if (curBrackets === 0) {
                return str;
            }
        }
        str = str.slice(1, -1);
    }
    return str;
}

export function mergeSets<T>(sets: Array<Set<T>>): Set<T> {
    return new Set([].concat(...sets.map(curSet => Array.from(curSet))));
}

export function eqSets<T>(a: Set<T>, b: Set<T>): boolean {
    if (a.size !== b.size) return false;
    return Array.from(a).every(element => b.has(element));
}

export function removeFromSet<T>(a: Set<T>, toRemove: Array<T>): void {
    toRemove.forEach(value => a.delete(value));
}
