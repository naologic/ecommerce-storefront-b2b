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
    availability: string;
    available: boolean;
    cost: number;
    countryOfOrigin: string;
    currency: string;
    depth: string;
    description: string;
    dimensionUOM: string;
    height: string;
    id: string;
    manufacturerItemCode: string;
    manufacturerItemId: string;
    ndcFreightClass: string;
    ndcHarmonizedTariffCode: string;
    ndcItemCode: string;
    images: string[];
    optionId: string;
    optionId1: string;
    optionId2: string;
    optionId3: string;
    optionValue: string;
    optionValue1: string;
    optionValue2: string;
    optionValue3: string;
    variantName: string;
    packaging: string;
    price: number;
    quantity: number;
    sku: string;
    volume: string;
    volumeUOM: string;
    weight: string;
    weightUOM: string;
    width: string;
}

export interface Product {
    _id: string;
    data?: {
        availability: string;
        available: true;
        barcode?: string;
        categories: Category[]
        currency: string;
        description: string;
        shortDescription: string;
        images: string[];
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

export interface ProductVariant {
    product: Product;
    variant: Variant;
}

export interface MyListToaster {
    productName: string;
    variantName: string;
    listName: string;
}
