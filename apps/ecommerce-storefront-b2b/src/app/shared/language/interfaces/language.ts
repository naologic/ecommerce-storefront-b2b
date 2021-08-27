import { InjectionToken } from '@angular/core';

export type LanguageDirection = 'ltr' | 'rtl';

export interface Language {
    code: string;
    name: string;
    image: string;
    direction: LanguageDirection;
}

export interface LanguageModuleConfig {
    default: string;
    languages: Language[];
}

export const DEFAULT_LANGUAGE = new InjectionToken<string>('DefaultLanguage');

export const LANGUAGES = new InjectionToken<Language[]>('Languages');

export const USER_LANGUAGES = new InjectionToken<string[]>('UserLanguages');
