import { NestedLink } from './link';


export interface MenuBase {
    type: string;
}

export type MegamenuSize = 'xl' | 'lg' | 'md' | 'nl' | 'sm';

export type MegamenuColumnSize = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | '1of1' | '1of2' | '1of3' | '1of4' | '1of5';

export interface MegamenuColumn {
    size: MegamenuColumnSize;
    links: NestedLink[];
}

export interface Megamenu extends MenuBase {
    type: 'megamenu';
    size: MegamenuSize;
    image?: string;
    columns: MegamenuColumn[];
}

export interface Menu extends MenuBase {
    type: 'menu';
    links: NestedLink[];
}
