import { ActiveFilter, Filter } from '../../../interfaces/filter';

export abstract class FilterHandler {
    abstract type: string;

    abstract serialize(value: any): string|null;

    abstract deserialize(value: string): any;

    abstract isDefaultValue(filter: Filter, value: any): boolean;

    abstract activeFilters(filter: Filter): ActiveFilter[];

    abstract getResetValue(activeFilters: ActiveFilter[]): any;
}
