import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-rating',
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.scss'],
})
export class RatingComponent {
    @Input() public value = 0;

    constructor() { }
}
