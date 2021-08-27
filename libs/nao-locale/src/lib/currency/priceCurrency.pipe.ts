import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CurrencyData } from '@naologic/nao-utils';
import { NaoUserAccessService } from '@naologic/nao-user-access';

/*
 * Show the value in currently selected currency
 * Usage:
 *   value | priceCurrency: 'EUR'
 * Example:
 *   {{ 22 | priceCurrency: 'EUR' }}
 *   formats to: 22 €
 *
 *
 * Currency Symbols:
 *    https://en.wikipedia.org/wiki/ISO_4217
 * Example currency info:
 *  {name: 'EURO', code: 'EUR', digitsInfo: '2.1-2', display: 'symbol'}
*/
@Pipe({
  name: 'priceCurrency'
})
export class PriceCurrencyPipe extends CurrencyPipe implements PipeTransform {
  public readonly currency: CurrencyData;
  constructor(
    public readonly naoUserAccessService: NaoUserAccessService
  ) {
    // -->Set: locale
    super(naoUserAccessService.getLocale('lang'));
    // -->Get: currency
    this.currency = this.naoUserAccessService.getLocale('currency');
  }
  transform(
    value: number,
    currencyCode: string,
    digitsInfo = this.currency.digitsInfo,
    display: 'code' | 'symbol' | 'symbol-narrow' | string = this.currency.display
  ): any {
    // -->Locale
    const curr$ = this.naoUserAccessService.findCurrency(currencyCode) || this.currency;
    // -->Get: currency code
    return super.transform(value, curr$.currencyCode, curr$.display, curr$.digitsInfo);
  }
}
