import { Component, Input } from '@angular/core';
import { Brand } from '../../../interfaces/brand';

export type BlockBrandsLayout = 'columns-8-full' | 'columns-7-sidebar';

@Component({
    selector: 'app-block-brands',
    templateUrl: './block-brands.component.html',
    styleUrls: ['./block-brands.component.scss'],
})
export class BlockBrandsComponent {
    @Input() public layout: BlockBrandsLayout = 'columns-8-full';
    @Input() public brands: Brand[] = [];

    constructor() { }
}
