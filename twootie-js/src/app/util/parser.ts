import {Sentence, SentenceType} from "../design/sentence";
import {SimpleSentence} from "../design/simpleSentence";
import {CompoundSentence, CompoundSentenceChildren} from "../design/compoundSentence";
import {stringToOperator} from "../design/operator";
import {stripBrackets, isPresent} from "./commonFunctions";
import {Justification} from "../design/justification";
import {Rule, DecompositionRule, stringToDecompositionRule} from "../design/rule";
import {QuantifiedSentence} from "../design/quantifiedSentence";
import {stringToQuantifier} from "../design/quantifier";
import {EqualitySentence} from "../design/equalitySentence";

export const BEGINNING_REGEX: string = "^";
export const ENDING_REGEX: string = "$";
export const LINE_REGEX: string = "(\\d+)";
export const TWO_LINE_REGEX: string = "(\\d+),(\\d+)";
export const OPERATOR_REGEX: string = "([&v><=])";
export const QUANTIFIER_REGEX: string = "\\(?([V\\]])([w-z])\\)?";
export const RULE_REGEX: string = "([-~]?[-~&v><V\\]=])";
export const ATOMIC_REGEX: string = "([A-UW-Z])([a-uw-z]*)";
export const EQUALITY_REGEX: string = "([(a-u)])=([(a-u)])";
export const SINGLE_SENTENCE_REGEX: string = "([-~]*(?:\\(?(?:[V\\]])(?:[x-z])\\)?)*(?:\\(?[A-Za-z-~&><=\\]\\(\\)]+\\)?|[A-Z][a-z]*))";
export const SENTENCE_REGEX: string = "([-~]*(?:\\(?(?:[V\\]])(?:[x-z])\\)?)*(?:\\([A-Za-z-~&><=\\]\\(\\)]+\\)|[A-Z][a-z]*))";

export const FREE_VARS: Array<string> = ["w", "x", "y", "z"];

export function parseStringToSentence(str: string, freeVars: Array<string> = []): Sentence {
    if (!isPresent(str)) {
        return SimpleSentence.createDefault();
    }
    str = stripBrackets(str.replace(/\s+/g, ""));

    if (new RegExp("[V\\]][" + freeVars.join("") + "]").test(str)) {
        // show error
        return new SimpleSentence(0, "");
    }

    // check whether it is negated
    let numNegated: number = 0;
    let negatedRegex: RegExp = new RegExp(BEGINNING_REGEX + "([-~¬]+).*");
    if (str !== null && !(typeof str === 'undefined')){
        if (negatedRegex.test(str)) {
            if (str.length === 2 || !str[1].match(/[a-z]/i)){
                let negatedGroups: RegExpExecArray = negatedRegex.exec(str);
                numNegated = negatedGroups[1].length;
                str = stripBrackets(str.slice(numNegated));
            }
        }
    }

    // simple sentence
    let atomicFormulaRegex: RegExp = new RegExp(BEGINNING_REGEX + ATOMIC_REGEX + ENDING_REGEX);
    if (atomicFormulaRegex.test(str)) {
        let atomicFormulaGroups: RegExpExecArray = atomicFormulaRegex.exec(str);
        let vars: Array<string> = atomicFormulaGroups[2].split("");
        for (let i: number = 0; i < FREE_VARS.length; i++) {
            let freeVar: string = FREE_VARS[i];
            if (freeVars.indexOf(freeVar) === -1 && vars.indexOf(freeVar) !== -1) {
                // show error
                return new SimpleSentence(0, "");
            }
        }
        return new SimpleSentence(
            numNegated,
            atomicFormulaGroups[1],
            vars
        );
    }

    let equalityFormulaRegex: RegExp = new RegExp(BEGINNING_REGEX + EQUALITY_REGEX + ENDING_REGEX);
    if (equalityFormulaRegex.test(str)) {
        let equalityFormulaGroups: RegExpExecArray = equalityFormulaRegex.exec(str);
        return new EqualitySentence(
            numNegated,
            equalityFormulaGroups[1],
            equalityFormulaGroups[2]
        );
    }

    // quantified sentence
    let quantifiedFormulaRegex: RegExp = new RegExp(
        BEGINNING_REGEX + QUANTIFIER_REGEX + SENTENCE_REGEX
    );
    if (quantifiedFormulaRegex.test(str)) {
        let quantifiedFormulaGroups: RegExpExecArray = quantifiedFormulaRegex.exec(str);
        let quantifierValue: string = quantifiedFormulaGroups[2];
        freeVars.push(quantifierValue);
        return new QuantifiedSentence(
            numNegated,
            stringToQuantifier(quantifiedFormulaGroups[1]),
            quantifierValue,
            parseStringToSentence(quantifiedFormulaGroups[3], freeVars)
        );
    }

    // compound sentence
    let compoundFormulaRegex: RegExp = new RegExp(
        BEGINNING_REGEX + SENTENCE_REGEX + OPERATOR_REGEX + SENTENCE_REGEX + ENDING_REGEX
    );
    if (compoundFormulaRegex.test(str)) {
        let compoundFormulaGroups: RegExpExecArray = compoundFormulaRegex.exec(str);
        return new CompoundSentence(
            numNegated,
            stringToOperator(compoundFormulaGroups[2]),
            new CompoundSentenceChildren(
                parseStringToSentence(compoundFormulaGroups[1], freeVars),
                parseStringToSentence(compoundFormulaGroups[3], freeVars)
            )
        );
    }

    // should send error here
    return SimpleSentence.createDefault();
}

export function parseStringToJustification(str: string): Justification {
    str = str.replace(/\s+/g, "");

    let smRegex: RegExp = new RegExp(
        BEGINNING_REGEX + SINGLE_SENTENCE_REGEX + "?\\/\\s*SM" + ENDING_REGEX
    );
    if (smRegex.test(str)) {
        let justificationGroups: RegExpExecArray = smRegex.exec(str);
        let userResult: string = justificationGroups[1] || "";
        let userSentence: Sentence = parseStringToSentence(stripBrackets(userResult));
        if (userSentence.type !== SentenceType.simpleSentence ||
            (userSentence.type === SentenceType.simpleSentence &&
            (<SimpleSentence> userSentence).value !== "")) {
            return new Justification(
                [-1],
                new DecompositionRule(false, Rule.SM),
                stripBrackets(userResult)
            )
        }
    }

    let justificationRegex: RegExp = new RegExp(
        BEGINNING_REGEX + SENTENCE_REGEX + "?\\/" + LINE_REGEX + RULE_REGEX + "[dD]" + ENDING_REGEX
    );
    if (justificationRegex.test(str)) {
        let justificationGroups: RegExpExecArray = justificationRegex.exec(str);

        let userResult: string = justificationGroups[1] || "";
        return new Justification(
            [+justificationGroups[2]],
            stringToDecompositionRule(justificationGroups[3]),
            stripBrackets(userResult)
        );
    }

    let twoLineJustificationRegex: RegExp = new RegExp(
        BEGINNING_REGEX + SENTENCE_REGEX + "?\\/" + TWO_LINE_REGEX + RULE_REGEX + "[dD]" + ENDING_REGEX
    );
    if (twoLineJustificationRegex.test(str)) {
        let justificationGroups: RegExpExecArray = twoLineJustificationRegex.exec(str);

        let userResult: string = justificationGroups[1] || "";
        return new Justification(
            [+justificationGroups[2], +justificationGroups[3]],
            stringToDecompositionRule(justificationGroups[4]),
            stripBrackets(userResult)
        );
    }

    // should send error here
    return new Justification([-1], new DecompositionRule(false, Rule.SM));
}
