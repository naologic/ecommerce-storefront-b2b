import { Component, Input } from '@angular/core';
import { ProductAttributeGroup } from '../../../interfaces/product';

@Component({
    selector: 'app-spec',
    templateUrl: './spec.component.html',
    styleUrls: ['./spec.component.scss'],
})
export class SpecComponent {
    @Input() public groups: ProductAttributeGroup[] = [];

    constructor() { }
}
