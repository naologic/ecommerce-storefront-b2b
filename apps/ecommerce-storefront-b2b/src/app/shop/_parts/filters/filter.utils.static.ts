import { CategoryFilter, CheckFilter, RangeFilter } from "../../../interfaces/filter";
import { nameToSlug } from "../../../shared/functions/utils";
import { AppInterface } from "../../../../app.interface";

/**
 * Prepare: categories filter
 */
function buildCategoriesFilter(items: any[], categoryId = null): CategoryFilter {
    if (!Array.isArray(items)) {
        items = [];
    }

    // -->Init: filterCategories
    let filterCategories = [];

    // -->Check: if there si a category selected
    if (!categoryId) {
        // -->Get: categories with level 0 and add children
        filterCategories = items.filter(c => !c.data.parentId);
    } else {
        // -->Get: current category
        const currentCategory = items.find(c => c.docId === categoryId)
        // -->Get: parent category
        const parent = items.find(c => c?.docId === currentCategory?.data?.parentId)
        // -->Get; children
        const children = items.filter(c => c.data?.parentId === currentCategory.docId);
        // -->Create: category
        const category = { ...currentCategory, children };

        // -->Check: if this category has parent
        if (parent) {
            category.parent = getParentsCategory(items, parent);
        }

        // -->Push: category
        filterCategories.push(category)
    }

    return {
        type: 'category',
        slug: 'category',
        name: 'Categories',
        items: filterCategories,
        value: categoryId,
    };
}

/**
 * Get: all parents for a category
 */
function getParentsCategory(items: any[], parentCategory: any): any {
    // -->Check: if the parent is root or not
    if (parentCategory?.data?.parentId) {
        const parent = items.find(c => c?.docId === parentCategory?.data?.parentId)
        // -->Return: and start the search again
        return { parent: getParentsCategory(items, parent), ...parentCategory }

    }
    return parentCategory;
}

/**
 * Prepare: manufactures filter
 */
function buildManufacturerFilter(vendors: AppInterface.Vendor[], values: string[]): CheckFilter {
    if(!Array.isArray(vendors)) {
        vendors = [];
    }

    // -->Init: items
    const items = [];

    // -->Iterate: over vendors
    vendors.map(vendor => {
        if (vendor) {
            items.push({
                docId: vendor.docId,
                slug: nameToSlug(vendor.data?.name),
                name: vendor.data?.name
            })
        }
    })

    return  {
        type: 'check',
        slug: 'manufacturer',
        name: 'Manufacturer',
        items: items,
        value: values || []
    }
}

/**
 * Prepare: price filter
 */
function buildPriceFilter(min: number, max: number, valueMin: number, valueMax: number, forceMinMax = false): RangeFilter {
    if (typeof min !== 'number') {
        min = 0;
    }

    if (typeof max !== 'number') {
        max = 0;
    }

    if (!valueMin || forceMinMax) {
        valueMin = min
    }

    if (!valueMax || forceMinMax) {
        valueMax = max
    }

    return  {
        type: 'range',
        slug: 'price',
        name: 'Price',
        min,
        max,
        value: [valueMin, valueMax]
    }
}

/**
 * Serialize: filter value
 */
function serializeFilterValue(filterType: string, value: string[] | [number, number]): string {
    switch (filterType) {
        case 'range':
            return value.join('-');
        case 'check':
        case 'rating':
            return value.join(',');
        default:
            return typeof value === 'string' ? value : null;
    }

}


/**
 * Deserialize: filter
 */
function deserializeFilterValue(filterType: string, value: any): any[] {
    switch (filterType) {
        case 'range':
            // const [min, max] = value.split('-').map(parseFloat);
            //
            // return [min, max];
        case 'check':
        case 'rating':
            // return value.join(',');
            return value ? value.split(',') : [];
        default:
            return value;
    }

}

export {
    deserializeFilterValue,
    serializeFilterValue,
    buildCategoriesFilter,
    buildManufacturerFilter,
    buildPriceFilter,
}
