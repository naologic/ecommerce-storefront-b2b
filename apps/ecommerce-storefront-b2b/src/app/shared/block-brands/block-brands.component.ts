import { Component, Input } from '@angular/core';

export type BlockBrandsLayout = 'columns-8-full' | 'columns-7-sidebar' | 'columns-12-full';

@Component({
    selector: 'app-block-brands',
    templateUrl: './block-brands.component.html',
    styleUrls: ['./block-brands.component.scss'],
})
export class BlockBrandsComponent {
    @Input() public layout: BlockBrandsLayout = 'columns-12-full';
    @Input() public partners: string[] = [];

    constructor() { }
}
