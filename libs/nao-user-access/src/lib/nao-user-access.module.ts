import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { NaoUserPermissionsGuard } from './nao-user-permissions.guard';
import { NaoUserAccessService } from './nao-user-access.service';
import { NgxPermissionsModule } from 'ngx-permissions';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NaoUserAccessHttpInterceptor } from './nao-user-access-http.interceptor';
import { NaoHttp2Module } from '@naologic/nao-http2';

interface NaoUsersOptions {
  ws?: any;
  users?: {
    updateEverySeconds?: number;
  };
  subscribeTo?: {
    companyUpdates?: boolean;
    userUpdates?: boolean;
  };
  api: { root: string };
  naoQueryOptions: { docName: string, cfpPath: string, userMode: string };
}

@NgModule({
  declarations: [],
  imports: [
    NaoHttp2Module,
    NgxPermissionsModule.forRoot({
      // permissionsIsolate: true,
      // rolesIsolate: true,
      // configurationIsolate: true
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: NaoUserAccessHttpInterceptor, multi: true },
    NaoUserPermissionsGuard,
    NaoUserAccessService
  ],
  exports: [
    NgxPermissionsModule
  ]
})
export class NaoUserAccessModule {
  constructor(@Optional() @SkipSelf() parentModule: NaoUserAccessModule) {
    if (parentModule) {
      throw new Error('NaoUsersModule is already loaded. Import it in the AppModule only');
    }
  }
  static forRoot(options?: NaoUsersOptions): ModuleWithProviders<NaoUserAccessModule> {
    return {
      ngModule: NaoUserAccessModule,
      providers: [
        { provide: 'userAccessOptions', useValue: options },
        NaoUserPermissionsGuard,
        NaoUserAccessService
      ]
    };
  }
  static forChild(): ModuleWithProviders<NaoUserAccessModule> {
    return {
      ngModule: NaoUserAccessModule
    };
  }
}
