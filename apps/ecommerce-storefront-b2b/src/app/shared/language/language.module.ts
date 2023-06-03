import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService } from './services/language.service';
import { DEFAULT_LANGUAGE, Language, LanguageModuleConfig, LANGUAGES, USER_LANGUAGES } from './interfaces/language';

export function languageInitFactory(
    language: LanguageService,
    defaultLanguage: string,
    userLanguages: string[],
): () => Promise<void> {
    return () => language.init(defaultLanguage, userLanguages);
}

@NgModule({
    imports: [
        CommonModule,
    ],
})
export class LanguageModule {
    static config(config: LanguageModuleConfig): ModuleWithProviders<LanguageModule> {
        return {
            ngModule: LanguageModule,
            providers: [
                LanguageService,
                {
                    provide: DEFAULT_LANGUAGE,
                    useValue: config.default,
                },
                {
                    provide: APP_INITIALIZER,
                    useFactory: languageInitFactory,
                    deps: [LanguageService, DEFAULT_LANGUAGE, USER_LANGUAGES],
                    multi: true,
                },
                {
                    provide: LANGUAGES,
                    useValue: config.languages,
                },
            ],
        };
    }
}
