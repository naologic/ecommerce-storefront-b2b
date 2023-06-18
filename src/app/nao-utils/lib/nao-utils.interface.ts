/**
 * Currency data formatted to ISO
 *    > https://en.wikipedia.org/wiki/ISO_4217
 *
 * Example curriencies:
 *    export const ActiveCurrencyList: CurrencyData[] = [
 *       {name: 'EURO', currencyCode: 'EUR', digitsInfo: '2.1-2', display: 'symbol'},
 *       {name: 'Dollar', currencyCode: 'USD', digitsInfo: '2.1-2', display: 'symbol'},
 *       {name: 'Romanian Leu', currencyCode: 'RON', digitsInfo: '2.1-2', display: 'symbol'},
 *       {name: 'Yuan', currencyCode: 'CNY', digitsInfo: '2.1-2', display: 'symbol'}
 *     ];
 */
import { Subscription } from "rxjs";

interface CurrencyData {
    code: string;
    name: string;
    currencyCode: string;   // like CurrencyTypes
    digitsInfo: string; //
    display: string;
    countryCode?: string;
    selected?: boolean;
}

interface CountryData {
    code?: string;
    name: string;
    countryCode: string;
    flag: string;
    selected?: boolean;
}

interface LanguageData {
    id?: number;
    alpha3?: string;
    lang: string; // 'en'
    langCode: string; // 'en-us'
    locals: string; // 'en'
    localeDate: string; // 'en-ie'
    dateFormat: string; // 'MM/DD/YYYY'
    timeFormat: string; // 'h:m a'
    dateShort: string; // 'MM/DD/YYYY'
    timeShort: string; // 'h:m a'
    name: string;
    countryCode?: string;
    selected?: boolean;
}

export {
    CurrencyData,
    CountryData,
    LanguageData
};

export namespace NaoDataInterface {
    export interface SelectFetchers {
        [index: string]: NaoDataInterface.SelectFetcher;
    }
    export interface SelectFetcher {
        sub$: Subscription;
        loading: boolean;
        deb: any;
        data: { [key: string]: any[] };
        value: any;
        /**
         * Create a select from the current data to reuse
         *    @example
         *        product --> variants
         */
        subSelectData?: any[];
        data$?: any;
    }

    export interface SubfieldImport {
        indexGroup: number;
        name: string;
        selectedAs: string;
        isArray: boolean;
        checkboxes: [];
    }
}
