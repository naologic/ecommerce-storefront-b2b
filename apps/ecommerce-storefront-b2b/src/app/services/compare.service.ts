import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Product, Variant, ProductVariant } from '../interfaces/product';

@Injectable({
    providedIn: 'root',
})
export class CompareService implements OnDestroy {
    private dataItems: ProductVariant[] = [];
    private destroy$: Subject<void> = new Subject();
    private itemsSubject$: BehaviorSubject<ProductVariant[]> = new BehaviorSubject<ProductVariant[]>([]);
    private onAddingSubject$: Subject<Variant> = new Subject();
    private onAddedSubject$: Subject<Variant> = new Subject();

    public readonly items$: Observable<ProductVariant[]> = this.itemsSubject$.pipe(takeUntil(this.destroy$));
    public readonly count$: Observable<number> = this.itemsSubject$.pipe(map((items) => items.length));
    public readonly onAdding$: Observable<Variant> = this.onAddingSubject$.asObservable();
    public readonly onAdded$: Observable<Variant> = this.onAddedSubject$.asObservable();

    constructor(
        @Inject(PLATFORM_ID) private platformId: any
    ) {
        if (isPlatformBrowser(this.platformId)) {
            this.load();
        }
    }

    /**
     * Add: product and variant to compare
     */
    public add(product: Product, variant: Variant): Observable<void> {
        // -->Check: product and variant
        if (!product || !variant) {
            return;
        }

        // -->Find: index
        const index = this.dataItems.findIndex(
            item => item.product._id === product._id && item.variant.id === variant.id
        );

        // -->Check: if product variant was already pushed
        if (index === -1) {
            // -->Emit: variant is being added
            this.onAddingSubject$.next(variant);

            // -->Add: compare item
            this.dataItems.push({ product: product, variant: variant });
            // -->Save
            this.save();
        } else {
            // -->Emit: variant was already added previously
            this.onAddedSubject$.next(variant);
        }

        // -->Complete
        return EMPTY;
    }

    /**
     * Remove: compare item
     */
    public remove(compareItem: ProductVariant): Observable<void> {
        // -->Check: compare item
        if (!compareItem) {
            return;
        }

        // -->Check: if this specific variant of the product is registered
        const index = this.dataItems.findIndex(
            item => item.product._id === compareItem.product._id && item.variant.id === compareItem.variant.id
        );

        // -->Remove: compare item
        if (index !== -1) {
            this.dataItems.splice(index, 1);
            // -->Save
            this.save();
        }

        // -->Complete
        return EMPTY;
    }

    /**
     * Reset: compare items
     */
    public clear(): Observable<void> {
        // -->Clear: compare items
        this.dataItems = [];
        // -->Save
        this.save();

        // -->Complete
        return EMPTY;
    }

    /**
     * Save: compare items to local storage
     */
    private save(): void {
        // -->Save: items
        localStorage.setItem('compareItems', JSON.stringify(this.dataItems));

        // -->Emit: items
        this.itemsSubject$.next(this.dataItems);
    }

    /**
     * Load: compare items from local storage
     */
    private load(): void {
        // -->Load: compare items
        const items = localStorage.getItem('compareItems');

        // -->Check: items
        if (items) {
            // -->Parse: and set data items
            this.dataItems = JSON.parse(items);
            // -->Emit: data items
            this.itemsSubject$.next(this.dataItems);
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
