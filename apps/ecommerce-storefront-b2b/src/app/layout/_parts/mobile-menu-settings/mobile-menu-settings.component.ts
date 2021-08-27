import { Component, OnInit } from '@angular/core';
import { LayoutMobileMenuService } from '../../layout-mobile-menu.service';
import { CurrencyService } from '../../../shared/currency/services/currency.service';
import { MobileMenuLink } from '../../../interfaces/mobile-menu-link';
import { LanguageService } from '../../../shared/language/services/language.service';

@Component({
    selector: 'app-mobile-menu-settings',
    templateUrl: './mobile-menu-settings.component.html',
    styleUrls: ['./mobile-menu-settings.component.scss'],
})
export class MobileMenuSettingsComponent implements OnInit {
    public languages: MobileMenuLink[] = [];
    public currencies: MobileMenuLink[] = [];

    constructor(
        public menu: LayoutMobileMenuService,
        public language: LanguageService,
        public currency: CurrencyService,
    ) { }

    public ngOnInit(): void {
        // -->Init: languages menu
        this.languages = this.language.all.map(x => ({
            title: x.name,
            image: x.image,
            customFields: {
                code: x.code,
            },
        }));
        // -->Init: currencies menu
        this.currencies = this.currency.all.map(x => ({
            title: `${x.symbol} ${x.name}`,
            customFields: {
                code: x.code,
            },
        }));
    }

    /**
     * Set: language
     */
    public setLanguage(item: MobileMenuLink): void {
        // -->Check: language code
        if (!item.customFields?.code) {
            return;
        }

        // -->Set: language
        this.language.set(item.customFields.code);
        // -->Close: language menu
        this.menu.close();
    }

    /**
     * Set: currency
     */
    public setCurrency(item: MobileMenuLink): void {
        // -->Check: currency code
        if (!item.customFields?.code) {
            return;
        }

        // -->Set: currency
        this.currency.set(item.customFields.code);
        // -->Close: currency menu
        this.menu.close();
    }
}
