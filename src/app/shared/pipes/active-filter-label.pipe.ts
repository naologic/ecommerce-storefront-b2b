import { ChangeDetectorRef, Inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { CurrencyService } from '../currency/services/currency.service';
import { CurrencyFormatPipe } from '../currency/pipes/currency-format.pipe';
import { appInfo$ } from "../../../app.static";

@Pipe({
    name: 'activeFilterLabel',
})
export class ActiveFilterLabelPipe implements PipeTransform {
    private currencyFormatPipe = new CurrencyFormatPipe(this.locale, this.currencyService);
    private translatePipe = new TranslatePipe(this.translateService, this.cdr);

    constructor(
        @Inject(LOCALE_ID) private locale: string,
        private currencyService: CurrencyService,
        private translateService: TranslateService,
        private cdr: ChangeDetectorRef,
    ) {}

    public transform(filter: any): string {
        this.currencyFormatPipe.transform(0);
        switch (filter.type) {
            case 'category': {
                // -->Search: for the selected category
                const category = appInfo$?.getValue()?.categories.find(f => f.docId === filter.value);
                // -->Return: With fall back as category
                return category?.data?.name || 'Category'
            }
            case 'searchTerm':
                return this.translatePipe.transform('ACTIVE_FILTER_SEARCH_TERM', { value: filter.value });
            case 'range':
                const [min, max] = filter.value?.split('-');

                return `${this.currencyFormatPipe.transform(min)} - ${this.currencyFormatPipe.transform(max)}`;
            case 'check':
                // -->Search: for the selected vendor
                const vendor = appInfo$?.getValue()?.vendors.find(f => f.docId === filter.value);
                // -->Return: With fall back as vendor
                return vendor?.data?.name || 'Manufacturer'
            case 'radio':
                return `${ filter.original.name }: ${ filter.item.name }`;
            case 'rating':
                return this.translatePipe.transform('TEXT_STARS', { stars: filter.item.rating });
        }

        return '';
    }
}
