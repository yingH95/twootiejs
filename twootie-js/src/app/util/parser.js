"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sentence_1 = require("../design/sentence");
var simpleSentence_1 = require("../design/simpleSentence");
var compoundSentence_1 = require("../design/compoundSentence");
var operator_1 = require("../design/operator");
var commonFunctions_1 = require("./commonFunctions");
var justification_1 = require("../design/justification");
var rule_1 = require("../design/rule");
var quantifiedSentence_1 = require("../design/quantifiedSentence");
var quantifier_1 = require("../design/quantifier");
var equalitySentence_1 = require("../design/equalitySentence");
exports.BEGINNING_REGEX = "^";
exports.ENDING_REGEX = "$";
exports.LINE_REGEX = "(\\d+)";
exports.TWO_LINE_REGEX = "(\\d+),(\\d+)";
exports.OPERATOR_REGEX = "([&v><=])";
exports.QUANTIFIER_REGEX = "\\(?([V\\]])([w-z])\\)?";
exports.RULE_REGEX = "([-~]?[-~&v><V\\]=])";
exports.ATOMIC_REGEX = "([A-UW-Z])([a-uw-z]*)";
exports.EQUALITY_REGEX = "([(a-u)])=([(a-u)])";
exports.SINGLE_SENTENCE_REGEX = "([-~]*(?:\\(?(?:[V\\]])(?:[x-z])\\)?)*(?:\\(?[A-Za-z-~&><=\\]\\(\\)]+\\)?|[A-Z][a-z]*))";
exports.SENTENCE_REGEX = "([-~]*(?:\\(?(?:[V\\]])(?:[x-z])\\)?)*(?:\\([A-Za-z-~&><=\\]\\(\\)]+\\)|[A-Z][a-z]*))";
exports.FREE_VARS = ["w", "x", "y", "z"];
function parseStringToSentence(str, freeVars) {
    if (freeVars === void 0) { freeVars = []; }
    if (!commonFunctions_1.isPresent(str)) {
        return simpleSentence_1.SimpleSentence.createDefault();
    }
    str = commonFunctions_1.stripBrackets(str.replace(/\s+/g, ""));
    if (new RegExp("[V\\]][" + freeVars.join("") + "]").test(str)) {
        // show error
        return new simpleSentence_1.SimpleSentence(0, "");
    }
    // check whether it is negated
    var numNegated = 0;
    var negatedRegex = new RegExp(exports.BEGINNING_REGEX + "([-~¬]+).*");
    if (str !== null && !(typeof str === 'undefined')) {
        if (negatedRegex.test(str)) {
            if (str.length === 2 || !str[1].match(/[a-z]/i)) {
                var negatedGroups = negatedRegex.exec(str);
                numNegated = negatedGroups[1].length;
                str = commonFunctions_1.stripBrackets(str.slice(numNegated));
            }
        }
    }
    // simple sentence
    var atomicFormulaRegex = new RegExp(exports.BEGINNING_REGEX + exports.ATOMIC_REGEX + exports.ENDING_REGEX);
    if (atomicFormulaRegex.test(str)) {
        var atomicFormulaGroups = atomicFormulaRegex.exec(str);
        var vars = atomicFormulaGroups[2].split("");
        for (var i = 0; i < exports.FREE_VARS.length; i++) {
            var freeVar = exports.FREE_VARS[i];
            if (freeVars.indexOf(freeVar) === -1 && vars.indexOf(freeVar) !== -1) {
                // show error
                return new simpleSentence_1.SimpleSentence(0, "");
            }
        }
        return new simpleSentence_1.SimpleSentence(numNegated, atomicFormulaGroups[1], vars);
    }
    var equalityFormulaRegex = new RegExp(exports.BEGINNING_REGEX + exports.EQUALITY_REGEX + exports.ENDING_REGEX);
    if (equalityFormulaRegex.test(str)) {
        var equalityFormulaGroups = equalityFormulaRegex.exec(str);
        return new equalitySentence_1.EqualitySentence(numNegated, equalityFormulaGroups[1], equalityFormulaGroups[2]);
    }
    // quantified sentence
    var quantifiedFormulaRegex = new RegExp(exports.BEGINNING_REGEX + exports.QUANTIFIER_REGEX + exports.SENTENCE_REGEX);
    if (quantifiedFormulaRegex.test(str)) {
        var quantifiedFormulaGroups = quantifiedFormulaRegex.exec(str);
        var quantifierValue = quantifiedFormulaGroups[2];
        freeVars.push(quantifierValue);
        return new quantifiedSentence_1.QuantifiedSentence(numNegated, quantifier_1.stringToQuantifier(quantifiedFormulaGroups[1]), quantifierValue, parseStringToSentence(quantifiedFormulaGroups[3], freeVars));
    }
    // compound sentence
    var compoundFormulaRegex = new RegExp(exports.BEGINNING_REGEX + exports.SENTENCE_REGEX + exports.OPERATOR_REGEX + exports.SENTENCE_REGEX + exports.ENDING_REGEX);
    if (compoundFormulaRegex.test(str)) {
        var compoundFormulaGroups = compoundFormulaRegex.exec(str);
        return new compoundSentence_1.CompoundSentence(numNegated, operator_1.stringToOperator(compoundFormulaGroups[2]), new compoundSentence_1.CompoundSentenceChildren(parseStringToSentence(compoundFormulaGroups[1], freeVars), parseStringToSentence(compoundFormulaGroups[3], freeVars)));
    }
    // should send error here
    return simpleSentence_1.SimpleSentence.createDefault();
}
exports.parseStringToSentence = parseStringToSentence;
function parseStringToJustification(str) {
    str = str.replace(/\s+/g, "");
    var smRegex = new RegExp(exports.BEGINNING_REGEX + exports.SINGLE_SENTENCE_REGEX + "?\\/\\s*SM" + exports.ENDING_REGEX);
    if (smRegex.test(str)) {
        var justificationGroups = smRegex.exec(str);
        var userResult = justificationGroups[1] || "";
        var userSentence = parseStringToSentence(commonFunctions_1.stripBrackets(userResult));
        if (userSentence.type !== sentence_1.SentenceType.simpleSentence ||
            (userSentence.type === sentence_1.SentenceType.simpleSentence &&
                userSentence.value !== "")) {
            return new justification_1.Justification([-1], new rule_1.DecompositionRule(false, rule_1.Rule.SM), commonFunctions_1.stripBrackets(userResult));
        }
    }
    var justificationRegex = new RegExp(exports.BEGINNING_REGEX + exports.SENTENCE_REGEX + "?\\/" + exports.LINE_REGEX + exports.RULE_REGEX + "[dD]" + exports.ENDING_REGEX);
    if (justificationRegex.test(str)) {
        var justificationGroups = justificationRegex.exec(str);
        var userResult = justificationGroups[1] || "";
        return new justification_1.Justification([+justificationGroups[2]], rule_1.stringToDecompositionRule(justificationGroups[3]), commonFunctions_1.stripBrackets(userResult));
    }
    var twoLineJustificationRegex = new RegExp(exports.BEGINNING_REGEX + exports.SENTENCE_REGEX + "?\\/" + exports.TWO_LINE_REGEX + exports.RULE_REGEX + "[dD]" + exports.ENDING_REGEX);
    if (twoLineJustificationRegex.test(str)) {
        var justificationGroups = twoLineJustificationRegex.exec(str);
        var userResult = justificationGroups[1] || "";
        return new justification_1.Justification([+justificationGroups[2], +justificationGroups[3]], rule_1.stringToDecompositionRule(justificationGroups[4]), commonFunctions_1.stripBrackets(userResult));
    }
    // should send error here
    return new justification_1.Justification([-1], new rule_1.DecompositionRule(false, rule_1.Rule.SM));
}
exports.parseStringToJustification = parseStringToJustification;
//# sourceMappingURL=parser.js.map