import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { defer, merge, Observable, of } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import { Language, LanguageDirection, LANGUAGES } from '../interfaces/language';

@Injectable()
export class LanguageService {
    public readonly current$: Observable<Language>;
    public readonly currentChange$: Observable<Language>;
    public readonly direction$: Observable<LanguageDirection>;
    public readonly directionChange$: Observable<LanguageDirection>;

    public get all(): Language[] { return this.languages; }

    public get default(): Language {
        const language = this.languages.find(x => x.code === this.translate.defaultLang);

        if (!language) {
            throw new Error('Language not found');
        }

        return language;
    }

    public get current(): Language {
        return this.languages.find(x => x.code === this.translate.currentLang) || this.default;
    }

    constructor(
        private translate: TranslateService,
        private router: Router,
        @Inject(LANGUAGES) private languages: Language[],
        @Inject(PLATFORM_ID) private platformId: any,
    ) {
        this.currentChange$ = this.translate.onLangChange.pipe(
            map(event => {
                const language = this.languages.find(x => x.code === event.lang);

                if (!language) {
                    throw new Error('Language not found');
                }

                return language;
            }),
        );
        this.current$ = merge(
            defer(() => of(this.current)),
            this.currentChange$,
        );

        this.directionChange$ = this.currentChange$.pipe(
            map(x => x.direction),
            distinctUntilChanged(),
        );
        this.direction$ = this.current$.pipe(
            map(x => x.direction),
            distinctUntilChanged(),
        );
    }

    /**
     * Set: language to use for translations.
     * Languages priority order: stored, user and default
     */
    public init(defaultLang: string, userLangs: string[]): Promise<void> {
        // -->Set: default language
        this.translate.setDefaultLang(defaultLang);

        userLangs = userLangs || [];
        userLangs = userLangs.reduce((acc, code) => [...acc, code.split('-').shift()!], userLangs);

        let storedLang: string|null = null;

        if (isPlatformBrowser(this.platformId)) {
            // ONLY_FOR_DEMO / START
            const { pathname, search } = document.location;
            const { lang } = this.router.parseUrl(pathname + search).queryParams;
            const urlLang = this.languages.map(x => x.code).find(x => x === lang);

            if (urlLang) {
                localStorage.setItem('language', urlLang);
            }
            // ONLY_FOR_DEMO / END

            // -->Get: stored language
            storedLang = localStorage.getItem('language');
            // -->Find: stored language by code
            storedLang = this.languages.map(x => x.code).find(x => x === storedLang) || null;
        }

        let userLang;
        for (const code of userLangs) {
            // -->Get: user language by code
            userLang = this.languages.map(x => x.code).find(x => x === code);

            // -->Check: user language
            if (userLang) {
                break;
            }
        }

        // -->Set: language to be used for translation
        return this.translate.use(storedLang || userLang || defaultLang).toPromise();
    }

    /**
     * Set: language to use for translations by code
     */
    public set(code: string): void {
        // -->Check: if current language is already the desired language
        if (this.current.code === code) {
            return;
        }

        // -->Use: language for translation
        this.translate.use(code);

        if (isPlatformBrowser(this.platformId)) {
            // -->Save: language preference in local storage
            localStorage.setItem('language', code);
        }
    }

    /**
     * Get: current language is right to left
     */
    public isRTL(): boolean {
        return this.current.direction === 'rtl';
    }
}
