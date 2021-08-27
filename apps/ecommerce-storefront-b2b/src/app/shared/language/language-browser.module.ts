import { NgModule } from '@angular/core';
import { CommonModule, PlatformLocation } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateCompiler, TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateMessageFormatCompiler } from 'ngx-translate-messageformat-compiler';
import { browserLoaderFactory } from './services/browser-loader.service';
import { USER_LANGUAGES } from './interfaces/language';

export function userLanguagesFactory(): string[] {
    if (window && window.navigator && window.navigator.languages) {
        return window.navigator.languages.slice(0);
    }
    if (window && window.navigator && window.navigator.language) {
        return [window.navigator.language];
    }

    return [];
}

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        TranslateModule.forRoot({
            compiler: {
                provide: TranslateCompiler,
                useClass: TranslateMessageFormatCompiler,
            },
            loader: {
                provide: TranslateLoader,
                useFactory: browserLoaderFactory,
                deps: [HttpClient, PlatformLocation],
            },
        }),
    ],
    exports: [
        TranslateModule,
    ],
    providers: [
        {
            provide: USER_LANGUAGES,
            useFactory: userLanguagesFactory,
        },
    ],
})
export class LanguageBrowserModule { }
