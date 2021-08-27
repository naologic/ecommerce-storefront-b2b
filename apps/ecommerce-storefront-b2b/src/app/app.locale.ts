import { registerLocaleData } from '@angular/common';
import { defineLocale as ngxBootstrapDefineLocale } from 'ngx-bootstrap/chronos';
import { LanguageData, CountryData, CurrencyData } from '@naologic/nao-utils';

/**
 * Active countries
 *
 *    CountryCode: https://en.wikipedia.org/wiki/ISO_3166-1
 */
const ActiveCountryList: CountryData[] = [
    {
        name: 'USA', countryCode: 'USA', flag: 'united-states.svg'
    },
];

/**
 * Active currencies
 *    @use https://en.wikipedia.org/wiki/ISO_4217
 */
const ActiveCurrencyList: CurrencyData[] =  [{ code: 'USD', currencyCode: 'USD',
    countryCode: 'us',
    digitsInfo: '1.0-2',
    display: 'symbol',
    name: 'Dollar',
    selected: true },
    { code: 'EUR', currencyCode: 'EUR',
        countryCode: 'eu',
        digitsInfo: '1.0-2',
        display: 'symbol',
        name: 'EURO',
        selected: true
    }
];

// const ActiveLanguageList: LanguageData[] = [
//  {
//    name: 'English', lang: 'en', langCode: 'en', locals: 'en', localeDate: 'en-ie', dateFormat: 'MM/DD/YYYY',
//    timeFormat: 'h:m a', dateShort: 'MM/DD/YYYY', timeShort: 'h:m a', flag: 'united-states.svg'
//  },
// ];

const ActiveLanguageList: LanguageData[] =  [{ alpha3: 'esp',
    countryCode: 'es',
    dateFormat: 'DD/MM/YYYY',
    dateShort: 'dd/LL/yyyy',
    id: 724,
    lang: 'es',
    langCode: 'es-ES',
    localeDate: 'es',
    locals: 'es',
    name: 'Spanish',
    selected: true,
    timeFormat: 'H:M',
    timeShort: 'H:M' },
    { alpha3: 'usa',
        countryCode: 'us',
        dateFormat: 'MM/DD/YYYY', // LL/dd/yyyy
        dateShort: 'LL/dd/yyyy', // LL/dd/yyyy
        id: 840,
        lang: 'en',
        langCode: 'en-us',
        localeDate: 'en-ie',
        locals: 'en',
        name: 'English US',
        selected: true,
        timeFormat: 'h:m a',
        timeShort: 'h:m a' }];


// -->Importing: Angular Locale

import localees from '@angular/common/locales/es';
registerLocaleData(localees);

import localeen from '@angular/common/locales/en';
registerLocaleData(localeen);

// import localeEn from '@angular/common/locales/en';
// registerLocaleData(localeEn);
// import localeFr from '@angular/common/locales/fr';
// registerLocaleData(localeFr);
// import localeRo from '@angular/common/locales/ro';
// registerLocaleData(localeRo);
// import localeCn from '@angular/common/locales/zh';
// registerLocaleData(localeCn);

// -->Importing: moment locale
// deprecated moment
// import 'moment/locale/es';
// import 'moment/locale/en-ie';

// -->Importing: ngx-bootstrap locale (date picker)
import { enGbLocale, frLocale } from 'ngx-bootstrap/locale';
// todo: maybe simplify with 'en'
ngxBootstrapDefineLocale('en-ie', enGbLocale);
ngxBootstrapDefineLocale('fr', frLocale);

export {
    ActiveCountryList,
    ActiveCurrencyList,
    ActiveLanguageList
};
