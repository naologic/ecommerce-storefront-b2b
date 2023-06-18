import { Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CurrencyService } from '../services/currency.service';

@Pipe({
    name: 'currencyFormat',
    pure: false,
})
export class CurrencyFormatPipe implements PipeTransform {
    private currencyPipe: CurrencyPipe = new CurrencyPipe(this.locale);

    constructor(
        @Inject(LOCALE_ID) private locale: string,
        private service: CurrencyService,
    ) { }

    public transform(
        value: number,
        currencyCode?: string,
        display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean,
        digitsInfo?: string,
        locale?: string,
    ): string | null {
        const currency = (currencyCode && this.service.all.find(x => x.code === currencyCode)) || this.service.current;

        // -->Check: currency
        if (!currency) {
            return this.currencyPipe.transform(value, currencyCode, display, digitsInfo, locale);
        }

        // -->Apply: currency rate
        value = value * currency.rate;

        // -->Set: format values (and default values)
        const formatFn = currency.formatFn || 'currency-pipe';
        const formatOptions = currency.formatOptions || {};

        // -->Check: if currency formatFn was provided
        if (formatFn === 'currency-pipe') {
            currencyCode = currencyCode || this.service.current.code;
            display = display || formatOptions.display;
            digitsInfo = digitsInfo || formatOptions.digitsInfo;
            locale = locale || formatOptions.locale;

            // -->Transform: value
            return this.currencyPipe.transform(value * this.service.current.rate, currencyCode, display, digitsInfo, locale);
        } else {
            // -->Execute: format function
            return formatFn(value, currency);
        }
    }
}
