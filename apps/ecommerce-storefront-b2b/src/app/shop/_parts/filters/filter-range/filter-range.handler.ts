import { FilterHandler } from '../filter.handler';
import { ActiveFilterRange, RangeFilter } from '../../../../interfaces/filter';

export class FilterRangeHandler extends FilterHandler {
    type = 'range';

    /**
     * Convert: array to string using '-' as separator
     */
    public serialize(value: [number, number]): string {
        return value.join('-');
    }

    /**
     * Convert: string to array assuming '-' as the separator
     */
    public deserialize(value: string): [number, number] {
        const [min, max] = value.split('-').map(parseFloat);

        return [min, max];
    }

    /**
     * Check: if value is the default
     */
    public isDefaultValue(filter: RangeFilter, value: [number, number]): boolean {
        return filter.min === value[0] && filter.max === value[1];
    }

    /**
     * Get: active filter
     */
    public activeFilters(filter: RangeFilter): ActiveFilterRange[] {
        if (this.isDefaultValue(filter, filter.value)) {
            return [];
        }

        // -->Build: and return active filter
        return [{
            id: filter.slug,
            type: filter.type,
            original: filter,
        }];
    }

    /**
     * Get: reset value
     */
    public getResetValue(activeFilters: ActiveFilterRange[]): string {
        return this.serialize([activeFilters[0].original.min, activeFilters[0].original.max]);
    }
}
