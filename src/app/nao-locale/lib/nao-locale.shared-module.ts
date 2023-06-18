import { NgModule } from '@angular/core';
import { FlowTranslatePipe } from './i18n/flowTranslate.pipe';
import { FormTranslateErrorsPipe } from './i18n/formTranslateErrors.pipe';
import { PricePipe } from './currency/price.pipe';
import { FormTranslateErrorsHTMLPipe } from './i18n/formTranslateErrorsHTML.pipe';
import { UsdPipe } from './currency/usd.pipe';
import { PriceCurrencyPipe } from './currency/priceCurrency.pipe';

@NgModule({
  declarations: [
    FlowTranslatePipe,
    FormTranslateErrorsPipe,
    FormTranslateErrorsHTMLPipe,
    PricePipe,
    UsdPipe,
    PriceCurrencyPipe,
  ],
  imports: [],
  providers: [
    PriceCurrencyPipe
  ],
  exports: [
    FlowTranslatePipe,
    FormTranslateErrorsPipe,
    FormTranslateErrorsHTMLPipe,
    PricePipe,
    UsdPipe,
    PriceCurrencyPipe,
  ]
})
export class NaoLocaleSharedModule {}
