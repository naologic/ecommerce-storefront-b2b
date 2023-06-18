import { Component, Input } from '@angular/core';

let uniqueId = 0;

@Component({
    selector: 'app-product-tab',
    templateUrl: './product-tab.component.html',
    styleUrls: ['./product-tab.component.scss'],
})
export class ProductTabComponent {
    @Input() public id = `product-tab-${++uniqueId}`;
    @Input() public label = '';
    @Input() public counter = 0;
    @Input() public showCounter = false;
    @Input() public isActive = false;

    constructor() { }
}
