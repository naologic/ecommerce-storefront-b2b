import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { NaoLocaleService } from './nao-locale.service';
import { NaoTranslateService } from './nao-translate.service';
import { NaoLocaleSharedModule } from './nao-locale.shared-module';

@NgModule({
  declarations: [],
  imports: [
    NaoLocaleSharedModule
  ],
  exports: []
})
export class NaoLocaleModule {
  constructor(@Optional() @SkipSelf() parentModule: NaoLocaleModule) {
    if (parentModule) {
      throw new Error('NaoLocaleModule is already loaded. Import it in the AppModule only');
    }
  }
  static forRoot(@Optional() utilsOptions?: any): ModuleWithProviders<NaoLocaleModule> {
    return {
      ngModule: NaoLocaleModule,
      providers: [
        { provide: 'localeData', useValue: utilsOptions },
        NaoLocaleService,
        NaoTranslateService
      ],
    };
  }
  static forChild(): ModuleWithProviders<NaoLocaleModule> {
    return {
      ngModule: NaoLocaleModule,
    };
  }
}
