import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { MobileMenuLink } from '../../../interfaces/mobile-menu-link';
import { LayoutMobileMenuService } from '../../layout-mobile-menu.service';
import { Router } from "@angular/router";

@Component({
    selector: 'app-mobile-menu-links',
    templateUrl: './mobile-menu-links.component.html',
    styleUrls: ['./mobile-menu-links.component.scss'],
})
export class MobileMenuLinksComponent {
    @Input() public items: MobileMenuLink[] = [];

    @Output() public itemClick: EventEmitter<MobileMenuLink> = new EventEmitter<MobileMenuLink>();

    constructor(
        private menu: LayoutMobileMenuService,
        private router: Router
    ) { }

    /**
     * Handle: menu item click.
     * Open panel if item has a submenu
     */
    public onItemClick(event: MouseEvent, item: MobileMenuLink | any, panel: TemplateRef<any>): void {
        // -->Check: item submenu
        if (item.submenu) {
            event.preventDefault();

            // -->Open: menu panel
            this.menu.openPanel(item.title, panel);
        } else {
            // -->Open: link
            if (!item.url) {
                return;
            }
            // -->Redirect: to the selected category
            this.router.navigateByUrl(item.url, { state: { resetFilters: true } }).then();
        }

        // -->Emit: item
        this.itemClick.emit(item);
    }
}
