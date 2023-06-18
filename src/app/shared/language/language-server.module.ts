import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {serverLoaderFactory} from './services/server-loader.service';
import {USER_LANGUAGES} from './interfaces/language';

export function userLanguagesFactory(): string[] {
  return [];
}

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: serverLoaderFactory,
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
export class LanguageServerModule {
}
