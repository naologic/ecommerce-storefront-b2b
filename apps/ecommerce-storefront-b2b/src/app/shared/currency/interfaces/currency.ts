import { InjectionToken } from '@angular/core';

export type CurrencyFormatFn = (value: number, currency: Currency) => string;

export interface CurrencyFormatOptions {
    display?: 'code' | 'symbol' | 'symbol-narrow' | string | boolean;
    digitsInfo?: string;
    locale?: string;
}

export interface Currency {
    symbol: string;
    name: string;
    code: string;
    rate: number;
    formatFn?: 'currency-pipe' | CurrencyFormatFn;
    formatOptions?: CurrencyFormatOptions;
}

export interface CurrencyModuleConfig {
    default: string;
    currencies: Currency[];
}

export const DEFAULT_CURRENCY = new InjectionToken<string>('DefaultCurrency');
export const CURRENCIES = new InjectionToken<Currency[]>('Currencies');
