import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MESSAGE_FORMAT_CONFIG, MessageFormatConfig } from 'ngx-translate-messageformat-compiler';
import { LanguageService } from './services/language.service';
import { DEFAULT_LANGUAGE, Language, LanguageModuleConfig, LANGUAGES, USER_LANGUAGES } from './interfaces/language';

export function languageInitFactory(
    language: LanguageService,
    defaultLanguage: string,
    userLanguages: string[],
): () => Promise<void> {
    return () => language.init(defaultLanguage, userLanguages);
}

export function messageFormatConfigFactory(languages: Language[]): () => MessageFormatConfig {
    return () => ({
        locales: languages.map(x => x.code),
    });
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
                {
                    provide: MESSAGE_FORMAT_CONFIG,
                    useFactory: messageFormatConfigFactory,
                    deps: [LANGUAGES],
                },
            ],
        };
    }
}
