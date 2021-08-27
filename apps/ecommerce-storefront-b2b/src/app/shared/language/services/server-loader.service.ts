import { Injectable } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { readFileSync } from 'fs';
import { join } from 'path';

export function serverLoaderFactory(): ServerLoaderService {
    return new ServerLoaderService();
}

@Injectable()
export class ServerLoaderService implements TranslateLoader {
    constructor() { }

    /**
     * Load: language translations from assets file
     */
    public getTranslation(lang: string): Observable<object> {
        return new Observable<object>(observer => {
            const path = join(process.cwd(), 'dist', 'ecommerce-storefront-b2b', 'browser', 'assets', 'i18n', `${lang}.json`);
            const data = JSON.parse(readFileSync(path, 'utf8'));

            observer.next(data);
            observer.complete();
        });
    }
}
