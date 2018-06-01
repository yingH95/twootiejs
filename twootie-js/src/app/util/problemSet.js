"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ProblemSet = (function () {
    function ProblemSet() {
        this.predicateLogicProbs = [
            { type: "PL",
                pid: 1,
                sentences: [
                    { line: 1, sen: "Vx(Gxa>Lxa)", just: "/SM", br: 0 },
                    { line: 2, sen: "Gca", just: "/SM", br: 0 },
                    { line: 3, sen: "-Lca", just: "/SM", br: 0 },
                ]
            }, { type: "PL",
                pid: 2,
                sentences: [
                    { line: 1, sen: "Vx(Cx>Lx)", just: "/SM", br: 0 },
                    { line: 2, sen: "Vy(CyvDy)", just: "/SM", br: 0 },
                    { line: 3, sen: "]x(-Lx)", just: "/SM", br: 0 },
                    { line: 4, sen: "-(]x(Dx))", just: "/SM", br: 0 },
                ]
            },
        ];
        this.sententialProbs = [
            { type: "SL",
                pid: 1,
                sentences: [
                    { line: 1, sen: "((D&K)&J)", just: "/SM", br: 0 },
                    { line: 2, sen: "(L&P)", just: "/SM", br: 0 },
                    { line: 3, sen: "-(K&L)", just: "/SM", br: 0 }
                ]
            },
        ];
    }
    Object.defineProperty(ProblemSet.prototype, "allPlProbs", {
        get: function () {
            return this.predicateLogicProbs;
        },
        enumerable: true,
        configurable: true
    });
    ProblemSet.prototype.getSlProbId = function (pid) {
        return this.sententialProbs.filter(function (prob) { return prob.pid === pid; })[0];
    };
    ProblemSet.prototype.getPlProbId = function (pid) {
        return this.predicateLogicProbs.filter(function (prob) { return prob.pid === pid; })[0];
    };
    ProblemSet.prototype.hasProbWithId = function (pid, type) {
        var obj = this.predicateLogicProbs.filter(function (prob) { return (prob.pid === pid && prob.type === type); });
        return (obj.length !== 0);
    };
    return ProblemSet;
}());
exports.ProblemSet = ProblemSet;
//# sourceMappingURL=problemSet.js.map