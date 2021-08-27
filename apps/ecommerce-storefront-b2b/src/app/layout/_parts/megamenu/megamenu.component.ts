import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Megamenu } from '../../../interfaces/menu';

@Component({
    selector: 'app-megamenu',
    templateUrl: './megamenu.component.html',
    styleUrls: ['./megamenu.component.scss'],
})
export class MegamenuComponent {
    @Input() public menu!: Megamenu;

    @Output() public itemClick: EventEmitter<any> = new EventEmitter<any>();

    constructor() { }
}
