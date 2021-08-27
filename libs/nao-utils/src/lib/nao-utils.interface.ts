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

