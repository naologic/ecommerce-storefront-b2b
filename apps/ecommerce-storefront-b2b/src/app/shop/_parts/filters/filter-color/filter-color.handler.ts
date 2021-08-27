import { FilterHandler } from '../filter.handler';
import { ActiveFilterColor, ColorFilter } from '../../../../interfaces/filter';

export class FilterColorHandler extends FilterHandler {
    type = 'color';

    /**
     * Convert: array to string using ',' as separator
     */
    public serialize(value: string[]): string {
        return value.join(',');
    }

    /**
     * Convert: string to array assuming ',' as the separator
     */
    public deserialize(value: string): string[] {
        return value !== '' ? value.split(',') : [];
    }

    /**
     * Check: if value is the default
     */
    public isDefaultValue(filter: ColorFilter, value: string[]): boolean {
        return value.length === 0;
    }

    /**
     * Get: active filters
     */
    public activeFilters(filter: ColorFilter): ActiveFilterColor[] {
        if (this.isDefaultValue(filter, filter.value)) {
            return [];
        }

        // -->Build: and return active filters array
        return filter.items.filter(x => filter.value.includes(x.slug)).map(item => ({
            id: `${filter.slug}/${item.slug}`,
            type: filter.type,
            original: filter,
            item,
        }));
    }

    /**
     * Get: reset value
     */
    public getResetValue(activeFilters: ActiveFilterColor[]): string {
        const itemSlugs = activeFilters.map(x => x.item.slug);

        return this.serialize(activeFilters[0].original.value.filter(x => !itemSlugs.includes(x)));
    }
}
