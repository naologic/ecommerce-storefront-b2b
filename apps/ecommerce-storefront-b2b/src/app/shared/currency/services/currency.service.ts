import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { skip } from 'rxjs/operators';
import { CURRENCIES, Currency } from '../interfaces/currency';

@Injectable()
export class CurrencyService {
    private currentSubject$: BehaviorSubject<Currency>;

    public readonly changes$: Observable<Currency>;
    public readonly all: ReadonlyArray<Currency> = [];

    public get current(): Currency {
        return this.currentSubject$.value;
    }

    constructor(
        @Inject(CURRENCIES) currencies: Currency[],
        @Inject(PLATFORM_ID) private platformId: any,
    ) {
        this.all = currencies;
        this.currentSubject$ = new BehaviorSubject<Currency>(this.all[0]);
        this.changes$ = this.currentSubject$.pipe(skip(1));

        // -->Load: currency info from local storage
        this.load();
    }

    /**
     * Set: currency by code
     */
    public set(code: string): void {
        // -->Get: currency by code
        const newCurrency = this.all.find(x => x.code === code);

        // -->Update: current currency if different
        if (newCurrency && newCurrency !== this.current) {
            this.currentSubject$.next(newCurrency);

            // -->Save: currency to local storage
            this.save();
        }
    }

    /**
     * Save: currency to local storage
     */
    private save(): void {
        if (isPlatformBrowser(this.platformId) && this.current) {
            localStorage.setItem('currency', this.current.code);
        }
    }

    /**
     * Load: currency from local storage
     */
    private load(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.set(localStorage.getItem('currency') || '');
        }
    }
}
