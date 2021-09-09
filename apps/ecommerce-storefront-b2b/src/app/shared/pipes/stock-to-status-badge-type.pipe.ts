import { Pipe, PipeTransform } from '@angular/core';
import { StatusBadgeType } from '../status-badge/status-badge.component';

@Pipe({
    name: 'stockToStatusBadgeType',
})
export class StockToStatusBadgeTypePipe implements PipeTransform {
    public transform(value: string, available: boolean): StatusBadgeType {
        // -->Check: Availability
        if (value === 'available') {
            return 'success';
        } else if (value === 'request') {
            return 'success';
        } else if (value === 'next-day') {
            return 'success'
        } else if (value === 'drop-ship-from-manufacturer') {
            return 'warning'
        } else if (value && value.endsWith('Days')) {
            return 'success'
        } else if (!value && available) {
            // -->Check: available
            return 'success'
        } else {
            return 'failure';
        }
    }
}
