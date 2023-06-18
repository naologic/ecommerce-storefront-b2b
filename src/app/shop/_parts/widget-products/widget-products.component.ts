import { Component, Input } from '@angular/core';
import { UrlService } from '../../../services/url.service';
import { Product } from '../../../interfaces/product';

@Component({
    selector: 'app-widget-products',
    templateUrl: './widget-products.component.html',
    styleUrls: ['./widget-products.component.scss'],
})
export class WidgetProductsComponent {
    @Input() public widgetTitle: string = '';
    @Input() public products: Product[] = [];

    constructor(
        public url: UrlService,
    ) { }
}
