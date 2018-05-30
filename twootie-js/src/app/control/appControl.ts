import {Sentence} from '../design/sentence';
import {Problem} from '../design/problem';
import {isPresent} from '../util/commonFunctions';
import {parseStringToSentence} from '../util/parser';
import {createEmptyProblem, createSLProblem, createPLProblem} from '../util/helper';
import {isUndefined} from "util";

export class AppControl {
    // should be current problem
    public sentence: Sentence;
    public currentProblem: Problem;

    constructor() {
        this.sentence = parseStringToSentence('(Dbc&-K)&-(--J&(Av--(~B&C)))');
        this.currentProblem = createEmptyProblem();
    }

    public newProblem(): void {
        this.currentProblem = createEmptyProblem();
    }

    public resetCurrentProblem(): void {
        if (isPresent(this.currentProblem)) {
            this.currentProblem.reset();
        }
    }

    public loadSLProblem(): void {
        this.currentProblem = createSLProblem();
    }

    public loadPLProblem(): void {
        this.currentProblem = createPLProblem();
    }

    private hasSelectedBranch(): boolean {
        return (typeof this.currentProblem.selectedBranch !== 'undefined')
            && (null !== this.currentProblem.selectedBranch)
    }

    public closeBranch(): void {
        if (this.hasSelectedBranch()){
            let brId = this.currentProblem.selectedBranch;
            this.currentProblem.closeBranch(brId);
        }
    }

    public openBranch(): void {
        if (this.hasSelectedBranch()){
            let brId = this.currentProblem.selectedBranch;
            this.currentProblem.openBranch(brId);
        }
    }

    public fillBranch(): void {
        if (this.hasSelectedBranch()){
            // TODO: need to implement this
        }
    }
}
