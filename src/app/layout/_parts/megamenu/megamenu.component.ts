import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Megamenu } from '../../../interfaces/menu';
import { Router } from "@angular/router";

@Component({
    selector: 'app-megamenu',
    templateUrl: './megamenu.component.html',
    styleUrls: ['./megamenu.component.scss'],
})
export class MegamenuComponent {
    @Input() public menu!: Megamenu;
    @Output() public itemClick: EventEmitter<any> = new EventEmitter<any>();

    constructor(private router: Router) { }

    /**
     * Redirect: and add reset filter state
     */
    public navigateAndResetFilters(url: string): void {
        if (!url) {
            return;
        }
        // -->Redirect: to the selected category
        this.router.navigateByUrl(url, { state: { resetFilters: true } }).then();
    }
}
