import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NestedLink } from '../../../interfaces/link';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
    @Input() public items: NestedLink[] = [];

    @Output() public itemClick: EventEmitter<any> = new EventEmitter<any>();

    constructor() { }
}
