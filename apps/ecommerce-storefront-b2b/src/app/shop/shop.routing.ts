import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NaoUserPermissionsGuard } from "@naologic/nao-user-access";
import { PageShopComponent } from './page-shop/page-shop.component';
import { PageProductComponent } from './page-product/page-product.component';
import { PageCartComponent } from './page-cart/page-cart.component';
import { PageCheckoutComponent } from './page-checkout/page-checkout.component';
import { PageWishlistComponent } from './page-wishlist/page-wishlist.component';
import { PageCompareComponent } from './page-compare/page-compare.component';


const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'category/products',
    },
    {
        path: 'category/products',
        component: PageShopComponent,
        data: {
            layout: 'grid',
            gridLayout: 'grid-4-sidebar',
            sidebarPosition: 'start',
        },
    },
    {
        path: 'category/:categorySlug/:categoryId/products',
        component: PageShopComponent,
        data: {
            layout: 'grid',
            gridLayout: 'grid-4-sidebar',
            sidebarPosition: 'start',
        },
    },
    {
        path: 'products/:productSlug/:productId',
        component: PageProductComponent,
        data: {
            layout: 'full'
        },
    },
    {
        path: 'cart',
        component: PageCartComponent,
    },
    {
        path: 'checkout',
        pathMatch: 'full',
        component: PageCheckoutComponent,
        canActivate: [NaoUserPermissionsGuard]
    },
    /*{
        path: 'wishlist',
        component: PageWishlistComponent,
    },*/
    /*{
        path: 'compare',
        component: PageCompareComponent,
    },*/
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
    providers: [],
})
export class ShopRoutingModule { }
