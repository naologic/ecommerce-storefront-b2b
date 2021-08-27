import { NgModule } from '@angular/core';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { ShopRoutingModule } from './shop.routing';
import { ShopPartsModule } from './_parts/shop.parts-module';
import { SharedModule } from '../shared/shared.module';
import { PageCartComponent } from './page-cart/page-cart.component';
import { PageCheckoutComponent } from './page-checkout/page-checkout.component';
import { PageCompareComponent } from './page-compare/page-compare.component';
import { PageProductComponent } from './page-product/page-product.component';
import { PageShopComponent } from './page-shop/page-shop.component';
import { PageMyListComponent } from './page-my-list/page-my-list.component';
import { PageMyListsComponent } from './page-my-lists/page-my-lists.component';

@NgModule({
    declarations: [
        PageCartComponent,
        PageCheckoutComponent,
        PageCompareComponent,
        PageProductComponent,
        PageShopComponent,
        PageMyListComponent,
        PageMyListsComponent,
    ],
    imports: [
        NgxPayPalModule,
        NgxSliderModule,
        ShopRoutingModule,
        ShopPartsModule,
        SharedModule
    ],
})
export class ShopModule { }
