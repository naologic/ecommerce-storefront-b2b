import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlatformLocation } from '@angular/common';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';

export function browserLoaderFactory(http: HttpClient, platformLocation: PlatformLocation): BrowserLoaderService {
    return new BrowserLoaderService(http, platformLocation);
}

@Injectable()
export class BrowserLoaderService implements TranslateLoader {
    constructor(
        private http: HttpClient,
        private platformLocation: PlatformLocation,
    ) { }

    /**
     * Get: translation from assets for the specified language
     */
    public getTranslation(lang: string): Observable<object> {
        return this.http.get(`${this.platformLocation.getBaseHrefFromDOM()}assets/i18n/${lang}.json`);
    }
}
