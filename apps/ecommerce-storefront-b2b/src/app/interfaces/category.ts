import { CustomFields } from './custom-fields';

export interface BaseCategory {
    id: number;
    type: string;
    name: string;
    slug: string;
    image: string|null;
    items?: number;
    parent?: this;
    children?: this[];
    customFields: CustomFields;
}

export type ShopCategoryLayout = 'categories' | 'products';

export interface ShopCategory extends BaseCategory {
    type: 'shop';
    layout: ShopCategoryLayout;
}

export type Category = ShopCategory;
