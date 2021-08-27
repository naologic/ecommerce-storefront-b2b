import { Component, Input, TemplateRef } from '@angular/core';
import { LayoutMobileMenuService } from '../../layout-mobile-menu.service';

@Component({
    selector: 'app-mobile-menu-panel',
    templateUrl: './mobile-menu-panel.component.html',
    styleUrls: ['./mobile-menu-panel.component.scss'],
})
export class MobileMenuPanelComponent {
    @Input() public level = 0;
    @Input() public label = '';
    @Input() public content: TemplateRef<any>|null = null;

    constructor(
        public menu: LayoutMobileMenuService,
    ) { }
}
