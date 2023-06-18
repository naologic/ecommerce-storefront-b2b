import {NgModule, PLATFORM_ID} from '@angular/core';
import {CommonModule, isPlatformBrowser, PlatformLocation} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {browserLoaderFactory} from './services/browser-loader.service';
import {USER_LANGUAGES} from './interfaces/language';

export function userLanguagesFactory(platformId: string): string[] {
  if (isPlatformBrowser(platformId)) {
    if (window && window.navigator && window.navigator.languages) {
      return window.navigator.languages.slice(0);
    }
    if (window && window.navigator && window.navigator.language) {
      return [window.navigator.language];
    }
  }

  return [];
}

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    TranslateModule.forRoot({
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
      deps: [PLATFORM_ID],
    },
  ],
})
export class LanguageBrowserModule {
}
