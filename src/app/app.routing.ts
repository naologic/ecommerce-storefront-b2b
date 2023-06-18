import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {RootComponent} from "./layout/root/root.component";
import {PageNotFoundComponent} from "./default-pages/page-not-found/page-not-found.component";

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () => import('./home/home.module').then(m => m.HomeModule),
      },
      {
        path: 'shop',
        loadChildren: () => import('./shop/shop.module').then(m => m.ShopModule),
      },
      {
        path: 'account',
        loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
      },
      {
        path: 'site',
        loadChildren: () => import('./site/site.module').then(m => m.SiteModule),
      },
      {
        path: '**',
        component: PageNotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'disabled',
      anchorScrolling: 'disabled',
      preloadingStrategy: PreloadAllModules,
      initialNavigation: 'enabledBlocking'
    }),
  ],
  exports: [
    RouterModule,
  ],
})
export class AppRoutingModule {
}
