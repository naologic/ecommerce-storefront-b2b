import { CustomFields } from './custom-fields';

export interface BaseAttribute {
    name: string;
    value?: string;
}

export interface BaseAttributeGroup {
    name: string;
    slug: string;
    customFields?: CustomFields;
}

export type ProductAttributeGroup = BaseAttributeGroup & { attributes: ProductAttribute[]; };

export interface ProductAttributeValue {
    name: string;
    slug: string;
    customFields?: CustomFields;
}

export interface ProductAttribute extends BaseAttribute {
    slug: string;
    featured: boolean;
    values: ProductAttributeValue[];
    customFields?: CustomFields;
}

export interface ProductOptionValueBase {
    name: string;
    id?: string;
    customFields?: CustomFields;
}

export interface ProductOptionValueColor extends ProductOptionValueBase {
    color: string;
}

export interface ProductOptionBase {
    type: string;
    name: string;
    id?: string;
    slug: string; // todo: remove this
    values: ProductOptionValueBase[];
    customFields?: CustomFields;
}

export interface ProductOptionDefault extends ProductOptionBase {
    type: 'default';
}

export interface ProductOptionColor extends ProductOptionBase {
    type: 'color';
    values: ProductOptionValueColor[];
}

export type ProductOption = ProductOptionDefault | ProductOptionColor;

export interface Category {
    id: string;
    isFeatured: boolean;
    level: number;
    name: string;
    parentId: number | string;
}


export interface Variant {
    /**
     * This item can only changed from the function, not by the user
     * @default InterfaceUtils.generateRandomString(12)
     */
    readonly id: string
    /** @default */
    available?: boolean
    /** @default {} */
    attributes?: any
    /** @default */
    cost: number
    /** @default USD */
    currency?: string
    depth?: number
    description?: string
    /** @default in */
    dimensionUOM?: string
    height?: number
    width?: number
    manufacturerItemCode?: string
    manufacturerItemId?: string
    packaging?: string
    /** @default */
    price: number
    volume?: number
    /** @default ci */
    volumeUOM?: string
    weight?: number
    /** @default lb */
    weightUOM?: string
    optionName: string
    optionsPath: string
    optionItemsPath: string
    images: Image[];
    sku?: string
    /** @default */
    active?: boolean
}

export interface Product {
    docId: string;
    data?: {
        availability: string;
        available: true;
        barcode?: string;
        categories: Category[]
        currency: string;
        description: string;
        shortDescription: string;
        images: Image[];
        isShippable: boolean;
        manufacturerId: string;
        name: string;
        options: any;
        price: number;
        sku: string;
        quantity: number;
        status: string;
        selectedVariant?: Variant;
        variants: Variant[];
        rating?: any; // todo: this would be for future use
        vendorId;
        manufacturer?: {
            data: {
                name: string;
                manufacturerId: string;
            },
            _id: string;
        };
        reviews?: number;
    }
}

export interface Image {
    fileName?: string
    cdnLink?: string
    i?: number
    alt?: string
}

export interface ProductVariant {
    product: Product;
    variant: Variant;
}

export interface MyListToaster {
    productName: string;
    variantName: string;
    listName: string;
}
