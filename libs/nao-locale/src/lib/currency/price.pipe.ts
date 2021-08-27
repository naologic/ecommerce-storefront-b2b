import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { CurrencyData } from '@naologic/nao-utils';
import { NaoUserAccessService } from '@naologic/nao-user-access';
/*
 * Show the value in currently selected currency
 * Usage:
 *   value | price
 * Example:
 *   {{ 22 | price }}
 *   formats to: 22 €
 *
 *
 * Currency Symbols:
 *    https://en.wikipedia.org/wiki/ISO_4217
 * Example currency info:
 *  {name: 'EURO', code: 'EUR', digitsInfo: '2.1-2', display: 'symbol'}
*/
@Pipe({
  name: 'price'
})
export class PricePipe extends CurrencyPipe implements PipeTransform {
  public readonly currency: CurrencyData;
  constructor(
    public readonly naoUserAccessService: NaoUserAccessService
  ) {
    // -->Set: locale
    super(naoUserAccessService.getLocale('language').langCode);
    // -->Get: currency
    this.currency = this.naoUserAccessService.getLocale('currency');
  }
  transform(
    value: number,
    digitsInfo = this.currency.digitsInfo,
    display: 'code' | 'symbol' | 'symbol-narrow' | string = this.currency.display
  ): any {
    return super.transform(value, this.currency.currencyCode, display, digitsInfo);
  }
}
