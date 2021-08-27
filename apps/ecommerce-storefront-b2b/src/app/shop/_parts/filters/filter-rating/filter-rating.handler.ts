import { FilterHandler } from '../filter.handler';
import { ActiveFilterRating, RatingFilter } from '../../../../interfaces/filter';

export class FilterRatingHandler extends FilterHandler {
    type = 'rating';

    /**
     * Convert: array to string using ',' as separator
     */
    public serialize(value: number[]): string {
        return value.join(',');
    }

    /**
     * Convert: string to array assuming ',' as the separator
     */
    public deserialize(value: string): number[] {
        return value !== '' ? value.split(',').map(parseFloat) : [];
    }

    /**
     * Check: if value is the default
     */
    public isDefaultValue(filter: RatingFilter, value: number[]): boolean {
        return value.length === 0;
    }

    /**
     * Get: active filters
     */
    public activeFilters(filter: RatingFilter): ActiveFilterRating[] {
        if (this.isDefaultValue(filter, filter.value)) {
            return [];
        }

        // -->Build: and return active filters array
        return filter.items.filter(x => filter.value.includes(x.rating)).map(item => ({
            id: `${filter.slug}/${item.rating}`,
            type: 'rating',
            original: filter,
            item,
        }));
    }

    /**
     * Get: reset value
     */
    public getResetValue(activeFilters: ActiveFilterRating[]): string {
        const itemSlugs = activeFilters.map(x => x.item.rating);

        return this.serialize(activeFilters[0].original.value.filter(x => !itemSlugs.includes(x)));
    }
}
