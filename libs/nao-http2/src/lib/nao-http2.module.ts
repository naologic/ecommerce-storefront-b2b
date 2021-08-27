import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import { NaoHttp2ApiService } from './nao-http2-api.service';
import { NaoHttp2Service } from './nao-http2.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
// import { NaoHttp2ApiInterceptor } from './nao-http2-api.interceptor';
import { RouterModule } from '@angular/router';
import {NaoHttp2ApiInterceptor} from "./nao-http2-api.interceptor";
// import { NaoSocketService } from './nao-socket.service';

@NgModule({
  declarations: [],
  imports: [
    RouterModule
  ],
  providers: [
    NaoHttp2Service,
    NaoHttp2ApiService
  ],
  exports: []
})
export class NaoHttp2Module {
  constructor(@Optional() @SkipSelf() parentModule: NaoHttp2Module) {
    if (parentModule) {
      throw new Error('NaoHttp2Module is already loaded. Import it in the AppModule only');
    }
  }
  static forRoot(@Optional() apiConfig?: any): ModuleWithProviders<NaoHttp2Module> {
    return {
      ngModule: NaoHttp2Module,
      providers: [
        { provide: 'apiConfig', useValue: apiConfig },
        // { provide: HTTP_INTERCEPTORS, useClass: NaoHttp2ApiInterceptor, multi: true },
        NaoHttp2Service,
        NaoHttp2ApiService,
        // NaoSocketService
      ]
    };
  }
  static forChild(): ModuleWithProviders<NaoHttp2Module> {
    return {
      ngModule: NaoHttp2Module
    };
  }
}
