import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppBrowserModule } from './app/app-browser.module';
import { environment } from './environments/environment';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * Start the app in standalone mode
 */
// bootstrapApplication(AppComponent, appConfig)
//   .catch((err) => console.error(err));


/**
 * Start the app in module mode
 */
if (environment.production) {
    enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
    platformBrowserDynamic().bootstrapModule(AppBrowserModule)
        .catch(err => console.error(err));
});
