import { Injectable } from '@angular/core';
import { NaoUsersInterface } from "@naologic/nao-user-access";
import { Category, ShopCategory } from '../interfaces/category';
import { Product } from '../interfaces/product';
import { nameToSlug } from "../shared/functions/utils";

@Injectable({
    providedIn: 'root',
})
export class UrlService {
    constructor() { }

    /**
     * Get: home url
     */
    public home(): string {
        return '/';
    }

    /**
     * Get: shop url
     */
    public shop(): string {
        return '/shop';
    }

    /**
     * Get: category url
     */
    public category(category: Category): string {
        return this.shopCategory(category);
    }

    /**
     * Get: shop category url
     */
    public shopCategory(category: ShopCategory): string {
        // -->Check: category name and id
        if (!category.name || !category.id) {
            return '';
        }

        // -->Slugify: the category name
        const categorySlug = nameToSlug(category.name);
        // -->Return: category url
        return `/shop/category/${categorySlug}/${category.id}/products`;
    }

    /**
     * Get: all products url
     */
    public allProducts(): string {
        return '/shop/category/products';
    }

    /**
     * Get: product url
     */
    public product(product: Product): string {
        // -->Check: product name and id
        if (!product.data?.name || !product._id) {
            return '';
        }

        // -->Slugify: the product name
        const productSlug = nameToSlug(product.data.name);
        // -->Return: product url
        return `/shop/products/${productSlug}/${product._id}`;
    }

    /**
     * Get: address url
     */
    public address(address: NaoUsersInterface.Address): string {
        // -->Check: address id
        if (!address.id) {
            return '';
        }

        return `/account/addresses/${address.id}`;
    }

    /**
     * Get: cart url
     */
    public cart(): string {
        return '/shop/cart';
    }

    /**
     * Get: checkout url
     */
    public checkout(): string {
        return '/shop/checkout';
    }

    /**
     * Get: login url
     */
    public login(): string {
        return '/account/login';
    }

    /**
     * Get: my lists url
     */
    public myLists(): string {
        return '/shop/my-lists';
    }

    /**
     * Get: my list url
     */
    public myList(id: string): string {
        if (!id) {
            return ''
        }

        return `/shop/my-list/${id}`;
    }
}
