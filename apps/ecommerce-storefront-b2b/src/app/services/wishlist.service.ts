import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Product, Variant, ProductVariant } from '../interfaces/product';

@Injectable({
    providedIn: 'root',
})
export class WishlistService implements OnDestroy {
    private dataItems: ProductVariant[] = [];
    private destroy$: Subject<void> = new Subject();
    private itemsSubject$: BehaviorSubject<ProductVariant[]> = new BehaviorSubject<ProductVariant[]>([]);
    private onAddingSubject$: Subject<Variant> = new Subject();
    private onAddedSubject$: Subject<Variant> = new Subject();

    public readonly items$: Observable<ProductVariant[]> = this.itemsSubject$.pipe(takeUntil(this.destroy$));
    public readonly count$: Observable<number> = this.itemsSubject$.pipe(map(items => items.length));
    public readonly onAdding$: Observable<Variant> = this.onAddingSubject$.asObservable();
    public readonly onAdded$: Observable<Variant> = this.onAddedSubject$.asObservable();

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
    ) {
        if (isPlatformBrowser(this.platformId)) {
            // -->Load: wishlist items
            this.load();
        }
    }

    /**
     * Add: product to wishlist
     */
    public add(product: Product, variant: Variant): Observable<void> {
        // -->Check: product and variant
        if (!product || !variant) {
            return;
        }

        // -->Find: index
        const index = this.dataItems.findIndex(item => item.product._id === product._id && item.variant.id === variant.id);

        // -->Check: if product variant is already on the wishlist
        if (index === -1) {
            // -->Emit: variant is being added
            this.onAddingSubject$.next(variant);

            // -->Add: wishlist item
            this.dataItems.push({ product, variant });
            // -->Save
            this.save();
        }
        else {
            // -->Emit: variant was already added to wishlist previously
            this.onAddedSubject$.next(variant);
        }

        // -->Complete
        return EMPTY;
    }

    /**
     * Remove: product from wishlist
     */
    public remove(wishlistItem: ProductVariant): Observable<void> { //ProductVariant
        // -->Check: if product is on the wishlist
        const index = this.dataItems.findIndex(item =>
            item.product._id === wishlistItem.product._id && item.variant.id === wishlistItem.variant.id);

        // -->Remove: product and save
        if (index !== -1) {
            this.dataItems.splice(index, 1);
            this.save();
        }

        // -->Complete
        return EMPTY;
    }

    /**
     * Save: wishlist items to local storage
     */
    private save(): void {
        localStorage.setItem('wishlistItems', JSON.stringify(this.dataItems));

        // -->Emit: items
        this.itemsSubject$.next(this.dataItems);
    }

    /**
     * Load: wishlist items from local storage
     */
    private load(): void {
        const items = localStorage.getItem('wishlistItems');

        // -->Check: items
        if (items) {
            // -->Parse: and set wishlist items
            this.dataItems = JSON.parse(items);
            // -->Emit: items
            this.itemsSubject$.next(this.dataItems);
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
