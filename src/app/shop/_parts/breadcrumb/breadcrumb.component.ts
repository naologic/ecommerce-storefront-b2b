import { Component, Input } from '@angular/core';
import { Router } from "@angular/router";

export interface BreadcrumbItem {
    label: string;
    url: string;
    state?: {
        resetFilters: boolean
    }
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

    constructor(private router: Router) { }

    /**
     * Redirect: and check if it has a state
     */
    public navigateAndAddState(url: string, state?: {resetFilters: boolean}): void {
        if (!url) {
            return;
        }
        if (state && typeof state === 'object') {
            // -->Redirect: to the link and add state
            this.router.navigateByUrl(url, { state }).then();
        } else {
            // -->Redirect: to the link without state
            this.router.navigateByUrl(url).then();
        }
    }
}
