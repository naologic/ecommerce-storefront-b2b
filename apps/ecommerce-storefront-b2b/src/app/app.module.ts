import { NgModule } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Router, Scroll, Event } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ToastrModule } from 'ngx-toastr';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { NaoHttp2Module } from "@naologic/nao-http2";
import { NaoUserAccessModule } from "@naologic/nao-user-access";
import { NaoLocaleModule } from "@naologic/nao-locale";
import { CurrencyModule } from './shared/currency/currency.module';
import { LanguageModule } from './shared/language/language.module';
import { LayoutModule } from './layout/layout.module';
import { AppRoutingModule } from './app.routing';
import { SharedModule } from './shared/shared.module';
import { ECommerceService } from "./e-commerce.service";
import { AppService } from "./app.service";
import { AccountAuthService } from "./account/account-auth.service";
import { AccountProfileService } from "./account/account-profile.service";
import { ActiveCountryList, ActiveCurrencyList, ActiveLanguageList } from "./app.locale";
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { RootComponent } from './layout/root/root.component';
import { PageNotFoundComponent } from './default-pages/page-not-found/page-not-found.component';
import { PageServerErrorComponent } from './default-pages/page-server-error/page-server-error.component';
import { BrowserJsonLdModule } from "./shared/seo-helper/json-ld.module";
import { ShopProductService } from "./shop/shop-product.service";


@NgModule({
    declarations: [
        AppComponent,
        RootComponent,
        PageNotFoundComponent,
        PageServerErrorComponent
    ],
    imports: [
        BrowserJsonLdModule,
        BrowserModule.withServerTransition({ appId: 'serverApp' }),
        ModalModule.forRoot(),
        ToastrModule.forRoot({
            positionClass: 'toast-bottom-left',
        }),
        TooltipModule.forRoot(),
        TranslateModule.forChild(),
        NaoHttp2Module.forRoot(environment.API),
        NaoUserAccessModule.forRoot(environment.naoUsers),
        NaoLocaleModule.forRoot({
            activeCountryList: ActiveCountryList,
            activeCurrencyList: ActiveCurrencyList,
            activeLanguageList: ActiveLanguageList,
            defaultCountry: 'USA',
            defaultCurrency: 'USD',
            defaultLanguage: 'en-us',
            defaultLocaleDate: 'en-ie'
        }),
        // todo: remove this and use or locale?
        CurrencyModule.config({
            default: 'USD',
            currencies: [
                {
                    symbol: '$',
                    name: 'US Dollar',
                    code: 'USD',
                    rate: 1,
                }
            ],
        }),
        // todo: remove and use our type of language files?
        LanguageModule.config({
            default: 'en',
            languages: [
                {
                    code: 'en',
                    name: 'English',
                    image: 'assets/images/languages/language-1.png',
                    direction: 'ltr',
                },
                {
                    code: 'ru',
                    name: 'Russian',
                    image: 'assets/images/languages/language-2.png',
                    direction: 'ltr',
                },
                {
                    code: 'en-RTL',
                    name: 'RTL',
                    image: 'assets/images/languages/language-3.png',
                    direction: 'rtl',
                },
            ],
        }),
        LayoutModule,
        AppRoutingModule,
        SharedModule
    ],
    providers: [
        ECommerceService,
        AppService,
        AccountAuthService,
        AccountProfileService,
        ShopProductService
    ]
})
export class AppModule {
    constructor(router: Router, viewportScroller: ViewportScroller) {
        router.events.pipe(
            filter((e: Event): e is Scroll => e instanceof Scroll),
        ).subscribe(e => {
            if (e.position) {
                viewportScroller.scrollToPosition(e.position);
            } else if (!e.anchor) {
                viewportScroller.scrollToPosition([0, 0]);
            }
        });
    }
}
