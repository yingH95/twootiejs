import {Branch} from './branch';
import {Justification} from './justification';
import {parseStringToJustification} from '../util/parser';
import {ProblemSentence} from './problemSentence';
import {Decomposer} from '../util/decomposer';
import {isPresent, mergeSets, eqSets} from '../util/commonFunctions';
import {SentenceType} from './sentence';
import {QuantifiedSentence} from './quantifiedSentence';
import {SimpleSentence} from './simpleSentence';
import {noSentenceConflicts} from '../util/helper';

export class Problem {
    public branchMap: Map<number, Branch> = new Map<number, Branch>();
    public branchChildrenMap: Map<number, Array<number>> = new Map<number, Array<number>>();
    private _maxBranchId: number = -1;
    private _completed: boolean = false;
    public selectedBranch: number | null;

    constructor(
        private _startingBranchSentences: Array<ProblemSentence>
    ) {
        this.setStartingBranch();
    }

    public get startingBranchSentences(): Array<ProblemSentence> {
        return this._startingBranchSentences;
    }

    public get completed(): boolean {
        return this._completed;
    }

    public decompose(branchId: number, justificationStr: string): void {
        this.getBranchFromId(branchId).resetErrorText();
        if (justificationStr.toLowerCase() === 'x') {
            this.closeBranch(branchId);
        } else if (justificationStr.toLowerCase() === 'open') {
            this.openBranch(branchId);
        } else {
            let justification: Justification = parseStringToJustification(justificationStr);
            Decomposer.decompose(this, branchId, justification);
        }
    }

    public addChildBranch(parentId: number,
                          problemSentences: Array<ProblemSentence>): void {
        let branchId: number = this._maxBranchId + 1;
        this.branchMap.set(branchId, new Branch(
            branchId,
            parentId,
            problemSentences,
            false
        ));
        if (this.branchChildrenMap.has(parentId)) {
            this.branchChildrenMap.get(parentId).push(branchId);
        } else {
            this.branchChildrenMap.set(parentId, [branchId]);
        }
        this._maxBranchId = branchId;
    }

    public getBranchFromId(branchId: number): Branch {
        return this.branchMap.get(branchId);
    }

    public branchHasChild(branchId: number): boolean {
        return this.branchChildrenMap.has(branchId);
    }

    public getChildBranches(branchId: number): Array<number> {
        if (this.branchHasChild(branchId)) {
            return this.branchChildrenMap.get(branchId);
        }
        return [];
    }

    public getProblemSentence(branchId: number, line: number): ProblemSentence {
        let branch: Branch = this.getBranchFromId(branchId);
        if (!isPresent(branch)) {
            return undefined;
        }
        let problemSentence: ProblemSentence = branch.getProblemSentence(line);
        if (!isPresent(problemSentence)) {
            return this.getProblemSentence(branch.parentId, line);
        }
        return problemSentence;
    }

    public checkOff(branchId: number, problemSentence: ProblemSentence): void {
        let line: number = problemSentence.lineNumber;
        let ancestorWithLine: number = this.getAncestorWithLine(branchId, line);
        if (this.lineShouldCheckOff(ancestorWithLine, line)) {
            problemSentence.setCheckedOff(true);
        }
    }

    private getAncestorWithLine(branchId: number, line: number): number {
        let curBranchId: number = branchId;
        while (!this.getBranchFromId(curBranchId).hasLine(line) &&
               curBranchId !== -1) {
            curBranchId = this.getBranchFromId(curBranchId).parentId;
        }
        return curBranchId;
    }

    public getBranchVariables(branchId: number, curVariables: Set<string> = new Set()): Set<string> {
        if (branchId === -1) {
            return curVariables;
        }
        let curBranch: Branch = this.getBranchFromId(branchId);
        return this.getBranchVariables(
            curBranch.parentId,
            mergeSets([curVariables, curBranch.variables])
        );
    }

    private lineShouldCheckOff(originBranchId: number, line: number): boolean {
        if (this.getBranchFromId(originBranchId).checkedOffLines.has(line)) {
            return true;
        }
        if (this.getChildBranches(originBranchId).length === 0) {
            return false;
        }
        return this.getChildBranches(originBranchId).every(childId =>
            this.lineShouldCheckOff(childId, line)
        );
    }

    public branchHasCheckedOffLine(branchId: number, line: number): boolean {
        let curBranchId: number = branchId;
        while (curBranchId !== -1) {
            let curBranch: Branch = this.getBranchFromId(curBranchId);
            if (curBranch.checkedOffLines.has(line)) {
                return true;
            }
            curBranchId = curBranch.parentId;
        }
        return false;
    }

    public getLineFreeVarSubstitutions(branchId: number, freeVar: string, line: number): Set<string> {
        let ancestorWithLine: number = this.getAncestorWithLine(branchId, line);
        return this.getBranchFromId(ancestorWithLine).getLineFreeVarSubstitutions(freeVar, line);
    }

    public addFreeVarSubstitution(branchId: number, line: number, freeVar: string, substitution: string): void {
        let ancestorWithLine: number = this.getAncestorWithLine(branchId, line);
        this.getBranchFromId(ancestorWithLine).addLineFreeVarSubstitution(line, freeVar, substitution);
    }

    public closeBranch(branchId: number): void {
        let simpleProblemSentences: Array<SimpleSentence> = this.allBranchProblemSentences(branchId)
            .filter(problemSentence => problemSentence.sentence.type === SentenceType.simpleSentence)
            .map(problemSentence => <SimpleSentence> problemSentence.sentence);
        if (!noSentenceConflicts(simpleProblemSentences)) {
            this.getBranchFromId(branchId).setClosed(true);
            this.getBranchFromId(branchId).setErrorText('');
            if (this.allBranchesClosed()) {
                alert('Tree is closed');
                return;
            }
        } else {
            this.getBranchFromId(branchId).setErrorText(
                'I did not find an ATOMIC SENTENCE and its negation on that branch!');
            return;
        }
    }

    private allBranchesClosed(): boolean {
        let branchesToTraverse: Array<number> = [0];
        while (branchesToTraverse.length !== 0) {
            let curBranchId: number = branchesToTraverse.shift();
            if (!this.branchHasChild(curBranchId) && !this.getBranchFromId(curBranchId).closed) {
                return false;
            }
            branchesToTraverse = branchesToTraverse.concat(this.getChildBranches(curBranchId));
        }
        return true;
    }

    public openBranch(branchId: number): void {
        if (this.branchFinishedDecomposing(branchId)) {
            let simpleProblemSentences: Array<SimpleSentence> = this.allBranchProblemSentences(branchId)
                .filter(problemSentence => problemSentence.sentence.type === SentenceType.simpleSentence)
                .map(problemSentence => <SimpleSentence> problemSentence.sentence);
            if (noSentenceConflicts(simpleProblemSentences)) {
                this.getBranchFromId(branchId).setErrorText('');
                alert('You are correct! You have a completed open branch.');
                this._completed = true;
                return;
            } else {
                this.getBranchFromId(branchId).setErrorText('Sorry, your current branch is CLOSED, not OPEN!');
                return;
            }
        } else {
            this.getBranchFromId(branchId).setErrorText('Sorry, your current branch is not complete.');
            return;
        }
    }

    private branchFinishedDecomposing(branchId: number): boolean {
        let problemSentences: Array<ProblemSentence> = this.allBranchProblemSentences(branchId);
        let checkedOff: Set<number> = this.allBranchCheckedOff(branchId);
        for (let i = 0; i < problemSentences.length; i++) {
            let curProblemSentence: ProblemSentence = problemSentences[i];
            if (!curProblemSentence.checkedOff && !checkedOff.has(curProblemSentence.lineNumber)) {
                if (curProblemSentence.sentence.type === SentenceType.quantifiedSentence) {
                    let quantifiedSentence: QuantifiedSentence = <QuantifiedSentence> curProblemSentence.sentence;
                    let substitutions: Set<string> = this.getLineFreeVarSubstitutions(
                        branchId, quantifiedSentence.quantifierValue, curProblemSentence.lineNumber);
                    if (!eqSets(substitutions, this.getBranchVariables(branchId))) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
        }
        return true;
    }

    private allBranchProblemSentences(branchId: number): Array<ProblemSentence> {
        let curBranchId: number = branchId;
        let problemSentences: Array<ProblemSentence> = [];
        while (curBranchId !== -1) {
            let curBranch: Branch = this.getBranchFromId(curBranchId);
            problemSentences = problemSentences.concat(curBranch.problemSentences);
            curBranchId = curBranch.parentId;
        }
        return problemSentences;
    }

    private allBranchCheckedOff(branchId: number): Set<number> {
        let curBranchId: number = branchId;
        let checkedOff: Set<number> = new Set<number>();
        while (curBranchId !== -1) {
            let curBranch: Branch = this.getBranchFromId(curBranchId);
            checkedOff = mergeSets([checkedOff, curBranch.checkedOffLines]);
            curBranchId = curBranch.parentId;
        }
        return checkedOff;
    }

    public reset(): void {
        this.branchMap = new Map<number, Branch>();
        this.branchChildrenMap = new Map<number, Array<number>>();
        this._maxBranchId = -1;
        this.setStartingBranch();
    }

    private setStartingBranch(): void {
        this.addChildBranch(-1, this._startingBranchSentences.map(
            startingSentence => startingSentence.copy()
        ));
    }

    public selectBranch(brId: number): void {
        if (brId !== 0){
            if(brId === this.selectedBranch){
                this.selectedBranch = null;
            } else {
                this.selectedBranch = brId;
            }
        }
    }
}
