import { Inject, Injectable } from "@angular/core";
import { NaoUsersInterface } from "../nao-user-access";
import { Product } from '../interfaces/product';
import { nameToSlug } from "../shared/functions/utils";
import { AppInterface } from "../../app.interface";
import { DOCUMENT } from "@angular/common";

@Injectable({
    providedIn: 'root',
})
export class UrlService {
    constructor(@Inject(DOCUMENT) private document: Document) { }

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
    public category(category: AppInterface.Category): string {
        return this.shopCategory(category);
    }

    /**
     * Get: shop category url
     */
    public shopCategory(category: AppInterface.Category): string {
        // -->Check: category name and id
        if (!category.data?.name || !category.docId) {
            return '';
        }

        // -->Slugify: the category name
        const categorySlug = nameToSlug(category.data?.name);
        // -->Return: category url
        return `/shop/category/${categorySlug}/${category.docId}/products`;
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
        if (!product?.data?.name || !product?.docId) {
            return '';
        }

        // -->Slugify: the product name
        const productSlug = nameToSlug(product.data.name);
        // -->Return: product url
        return `/shop/products/${productSlug}/${product.docId}`;
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


    /**
     * Open: a link in a new tab
     */
    public openLinkInNewTab(url: string): void {
        if (!url) {
            return;
        }
        const link = this.document.createElement('a');
        link.href = url;
        link.target = '_blank';
        this.document.body.appendChild(link);
        link.click();
        link.remove();
    }
}
