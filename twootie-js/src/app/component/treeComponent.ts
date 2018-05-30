import {Component, Input, ViewEncapsulation} from '@angular/core';
import {Problem} from "../design/problem";

@Component({
    selector: 'tree',
    templateUrl: './../html/treeComponent.ng.html',
    styleUrls: ['./../css/treeComponent.css'],
    encapsulation: ViewEncapsulation.None
})

export class TreeComponent {
    @Input() public problem: Problem;
    @Input() public branchId: number;
}
