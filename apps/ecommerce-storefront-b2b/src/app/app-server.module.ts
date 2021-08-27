import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule } from '@angular/platform-server';
import { AppModule } from './app.module';
import { LanguageServerModule } from './shared/language/language-server.module';
import { AppComponent } from './app.component';

@NgModule({
    imports: [
        NoopAnimationsModule,
        ServerModule,
        AppModule,
        LanguageServerModule,
    ],
    bootstrap: [AppComponent],
})
export class AppServerModule {}
