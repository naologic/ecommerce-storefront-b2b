import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyFormatPipe } from './pipes/currency-format.pipe';
import { CurrencyService } from './services/currency.service';
import { CURRENCIES, CurrencyModuleConfig, DEFAULT_CURRENCY } from './interfaces/currency';

@NgModule({
    declarations: [
        CurrencyFormatPipe,
    ],
    exports: [
        CurrencyFormatPipe,
    ],
    imports: [
        CommonModule,
    ],
})
export class CurrencyModule {
    static config(config: CurrencyModuleConfig): ModuleWithProviders<CurrencyModule> {
        return {
            ngModule: CurrencyModule,
            providers: [
                CurrencyService,
                {
                    provide: DEFAULT_CURRENCY,
                    useValue: config.default,
                },
                {
                    provide: CURRENCIES,
                    useValue: config.currencies,
                },
            ],
        };
    }
}
