import { Component } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { MyListsService } from '../../../services/my-lists.service';
import { LayoutMobileMenuService } from '../../layout-mobile-menu.service';

@Component({
    selector: 'app-mobile-menu-indicators',
    templateUrl: './mobile-menu-indicators.component.html',
    styleUrls: ['./mobile-menu-indicators.component.scss'],
})
export class MobileMenuIndicatorsComponent {
    constructor(
        public menu: LayoutMobileMenuService,
        public cart: CartService,
        public wishlist: MyListsService,
    ) { }
}
