import { Component, EventEmitter, Output } from '@angular/core';
import { CartService } from '../../../services/cart.service';
import { UrlService } from '../../../services/url.service';

@Component({
    selector: 'app-dropcart',
    templateUrl: './dropcart.component.html',
    styleUrls: ['./dropcart.component.scss'],
})
export class DropcartComponent {
    @Output() public closeMenu: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        public cart: CartService,
        public url: UrlService,
    ) { }
}
