import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NaoUserPermissionsGuard } from "@naologic/nao-user-access";
import { PageProductComponent } from './page-product/page-product.component';
import { PageCartComponent } from './page-cart/page-cart.component';
import { PageCheckoutComponent } from './page-checkout/page-checkout.component';
import { PageMyListComponent } from './page-my-list/page-my-list.component';
import { PageCompareComponent } from './page-compare/page-compare.component';
import { PageMyListsComponent } from './page-my-lists/page-my-lists.component';
import { PageShopListComponent } from "./page-shop-list/page-shop-list.component";


const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'category/products',
    },
    {
        path: 'category/products',
        component: PageShopListComponent,

    },
    {
        path: 'category/:categorySlug/:categoryId/products',
        component: PageShopListComponent,
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
    {
        path: 'my-lists',
        component: PageMyListsComponent,
        canActivate: [NaoUserPermissionsGuard]
    },
    {
        path: 'my-list/:id',
        component: PageMyListComponent,
        canActivate: [NaoUserPermissionsGuard]
    },
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
