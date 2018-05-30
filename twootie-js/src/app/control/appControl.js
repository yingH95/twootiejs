"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var commonFunctions_1 = require("../util/commonFunctions");
var parser_1 = require("../util/parser");
var helper_1 = require("../util/helper");
var AppControl = (function () {
    function AppControl() {
        this.sentence = parser_1.parseStringToSentence('(Dbc&-K)&-(--J&(Av--(~B&C)))');
        this.currentProblem = helper_1.createEmptyProblem();
    }
    AppControl.prototype.newProblem = function () {
        this.currentProblem = helper_1.createEmptyProblem();
    };
    AppControl.prototype.resetCurrentProblem = function () {
        if (commonFunctions_1.isPresent(this.currentProblem)) {
            this.currentProblem.reset();
        }
    };
    AppControl.prototype.loadSLProblem = function () {
        this.currentProblem = helper_1.createSLProblem();
    };
    AppControl.prototype.loadPLProblem = function () {
        this.currentProblem = helper_1.createPLProblem();
    };
    AppControl.prototype.hasSelectedBranch = function () {
        return (typeof this.currentProblem.selectedBranch !== 'undefined')
            && (null !== this.currentProblem.selectedBranch);
    };
    AppControl.prototype.closeBranch = function () {
        if (this.hasSelectedBranch()) {
            var brId = this.currentProblem.selectedBranch;
            this.currentProblem.closeBranch(brId);
        }
    };
    AppControl.prototype.openBranch = function () {
        if (this.hasSelectedBranch()) {
            var brId = this.currentProblem.selectedBranch;
            this.currentProblem.openBranch(brId);
        }
    };
    AppControl.prototype.fillBranch = function () {
        if (this.hasSelectedBranch()) {
            // TODO: need to implement this
        }
    };
    return AppControl;
}());
exports.AppControl = AppControl;
//# sourceMappingURL=appControl.js.map