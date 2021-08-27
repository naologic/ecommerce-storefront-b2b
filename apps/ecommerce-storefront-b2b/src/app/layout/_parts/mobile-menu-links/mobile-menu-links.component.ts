import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { MobileMenuLink } from '../../../interfaces/mobile-menu-link';
import { LayoutMobileMenuService } from '../../layout-mobile-menu.service';

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
    ) { }

    /**
     * Handle: menu item click.
     * Open panel if item has a submenu
     */
    public onItemClick(event: MouseEvent, item: MobileMenuLink, panel: TemplateRef<any>): void {
        // -->Check: item submenu
        if (item.submenu) {
            event.preventDefault();

            // -->Open: menu panel
            this.menu.openPanel(item.title, panel);
        }

        // -->Emit: item
        this.itemClick.emit(item);
    }
}
