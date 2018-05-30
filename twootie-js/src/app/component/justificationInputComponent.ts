import {Component, Input} from '@angular/core';
import {Problem} from '../design/problem';

@Component({
    selector: 'justification-input',
    templateUrl: './../html/justificationInputComponent.ng.html'
})

export class JustificationInputComponent {
    @Input() public problem: Problem;
    @Input() public branchId: number;

    public justification_sentence: string = '';

    public decompose(): void {
        this.problem.decompose(this.branchId, this.justification_sentence);
        this.justification_sentence = '';
    }
}
