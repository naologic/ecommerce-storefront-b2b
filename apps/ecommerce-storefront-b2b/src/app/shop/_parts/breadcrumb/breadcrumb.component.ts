import { Component, Input } from '@angular/core';

export interface BreadcrumbItem {
    label: string;
    url: string;
}

@Component({
    selector: 'app-breadcrumb',
    templateUrl: './breadcrumb.component.html',
    styleUrls: ['./breadcrumb.component.scss'],
})
export class BreadcrumbComponent {
    @Input() public items: BreadcrumbItem[] = [];
    @Input() public withPageTitle = false;
    @Input() public afterHeader = true;

    constructor() { }
}
