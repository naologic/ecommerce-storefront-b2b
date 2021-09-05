import { Product } from './product';
import { Filter } from './filter';

export interface List<T> {
    /** Array of list items. */
    items: T[];
}

export interface PaginatedList<T> extends List<T> {
    /** Current page. */
    page: number;

    /** Items per page. */
    limit: number;

    /** Sorting algorithm. */
    sort: string;

    /** Total items in list. Not a items.length. */
    total: number;

    /** Total number of pages. */
    pages: number;

    /** Common number of the first item on the current page. */
    from: number;

    /** Common number of the last item on the current page. */
    to: number;
}

export interface FilterableList<T> extends List<T> {
    filters: Filter[];
}

export type ProductsList = PaginatedList<Product> & FilterableList<Product>;

export interface ActiveFilter {
    slug: string;
    type: string;
    value: string;
}

export type PageShopLayout =
    'grid' |
    'grid-with-features' |
    'list' |
    'table';

export interface LayoutButton {
    layout: PageShopLayout;
    icon: string;
}
