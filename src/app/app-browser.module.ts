import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppModule } from './app.module';
import { LanguageBrowserModule } from './shared/language/language-browser.module';
import { AppComponent } from './app.component';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        AppModule,
        LanguageBrowserModule,
    ],
    bootstrap: [AppComponent],
})
export class AppBrowserModule {}
