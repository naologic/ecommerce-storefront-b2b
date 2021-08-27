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
import { PageWishlistComponent } from './page-wishlist/page-wishlist.component';

@NgModule({
    declarations: [
        PageCartComponent,
        PageCheckoutComponent,
        PageCompareComponent,
        PageProductComponent,
        PageShopComponent,
        PageWishlistComponent,
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
