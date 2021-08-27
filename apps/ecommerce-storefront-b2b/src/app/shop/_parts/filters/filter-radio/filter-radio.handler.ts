import { FilterHandler } from '../filter.handler';
import { ActiveFilterRadio, RadioFilter } from '../../../../interfaces/filter';

export class FilterRadioHandler extends FilterHandler {
    type = 'radio';

    /**
     * Serialize: value
     */
    public serialize(value: string): string {
        return value;
    }

    /**
     * Deserialize: value
     */
    public deserialize(value: string): string {
        return value;
    }

    /**
     * Check: if value is the default
     */
    public isDefaultValue(filter: RadioFilter, value: string|null): boolean {
        return filter.items[0].slug === value;
    }

    /**
     * Get: active filters
     */
    public activeFilters(filter: RadioFilter): ActiveFilterRadio[] {
        if (this.isDefaultValue(filter, filter.value)) {
            return [];
        }

        // -->Find: filter item by slug
        const item = filter.items.find(x => x.slug === filter.value);
        // -->Check: item
        if (!item) {
            throw new Error('Filter item not found');
        }

        // -->Build: and return active filter
        return [{
            id: filter.slug,
            type: filter.type,
            original: filter,
            item,
        }];
    }

    /**
     * Get: reset value
     */
    public getResetValue(activeFilters: ActiveFilterRadio[]): string {
        return activeFilters[0].original.items[0].slug;
    }
}
