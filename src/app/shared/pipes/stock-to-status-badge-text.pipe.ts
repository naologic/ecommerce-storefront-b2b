import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'stockToStatusBadgeText',
})
export class StockToStatusBadgeTextPipe implements PipeTransform {
    public transform(value: string, available: boolean): string {
        // -->Check: Availability
        if (value === 'available') {
            return 'TEXT_STOCK_IN_STOCK';
        } else if (value === 'request') {
            return 'TEXT_STOCK_ON_REQUEST';
        } else if (value === 'next-day') {
            return 'TEXT_STOCK_NEXT_DAY'
        } else if (value === 'drop-ship-from-manufacturer') {
            return 'TEXT_STOCK_DROP_SHIP_MANUFACTURER'
        } else if (value && value.endsWith('Days')) {
            return value
        } else if (!value && available) {
            return 'TEXT_STOCK_IN_STOCK';
        } else {
            return 'TEXT_STOCK_OUT_OF_STOCK';
        }
    }
}
