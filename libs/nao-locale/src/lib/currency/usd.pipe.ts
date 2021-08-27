import { Pipe } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | usdPipe
 * Example:
 *   {{ 22 | usdPipe }}
 *   formats to: $22.55
 *
 *
 * Currency Symbols:
 *    https://en.wikipedia.org/wiki/ISO_4217
*/
@Pipe({
  name: 'usdPipe'
})
export class UsdPipe extends CurrencyPipe {
  transform(
    value: number,
    digitsInfo = '2.1-2',
    display: 'code' | 'symbol' | 'symbol-narrow' | string = 'symbol'
  ): any {
    return super.transform(value, 'USD', display, digitsInfo);
  }
}
