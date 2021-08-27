import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, EMPTY, Observable, of, Subject, timer } from 'rxjs';
import { Product, Variant } from '../interfaces/product';
import { CartItem, CartData, CartTotal } from '../interfaces/cart';

@Injectable({
    providedIn: 'root',
})
export class CartService {
    private data: CartData = {
        items: [],
        quantity: 0,
        subtotal: 0,
        totals: [],
        total: 0,
    };
    private itemsSubject$: BehaviorSubject<CartItem[]> = new BehaviorSubject(this.data.items);
    private quantitySubject$: BehaviorSubject<number> = new BehaviorSubject(this.data.quantity);
    private subtotalSubject$: BehaviorSubject<number> = new BehaviorSubject(this.data.subtotal);
    private totalsSubject$: BehaviorSubject<CartTotal[]> = new BehaviorSubject(this.data.totals);
    private totalSubject$: BehaviorSubject<number> = new BehaviorSubject(this.data.total);
    private onAddingSubject$: Subject<Variant> = new Subject();

    public readonly items$: Observable<CartItem[]> = this.itemsSubject$.asObservable();
    public readonly quantity$: Observable<number> = this.quantitySubject$.asObservable();
    public readonly subtotal$: Observable<number> = this.subtotalSubject$.asObservable();
    public readonly totals$: Observable<CartTotal[]> = this.totalsSubject$.asObservable();
    public readonly total$: Observable<number> = this.totalSubject$.asObservable();
    public readonly onAdding$: Observable<Variant> = this.onAddingSubject$.asObservable();

    public get items(): ReadonlyArray<CartItem> {
        return this.data.items;
    }

    public get subtotal(): number {
        return this.data.subtotal;
    }

    public get totals(): ReadonlyArray<CartTotal> {
        return this.data.totals;
    }

    public get quantity(): number {
        return this.data.quantity;
    }

    public get total(): number {
        return this.data.total;
    }

    constructor(
        @Inject(PLATFORM_ID) private platformId: any
    ) {
        if (isPlatformBrowser(this.platformId)) {
            // -->Load: and calculate
            this.load();
            this.calc();
        }
    }

    /**
     * Add: item to the cart
     */
    public add(product: Product, variant: Variant, quantity: number): Observable<CartItem> {
        // -->Check: product and variant and if variant has a price key
        if (!product || !variant || !variant.hasOwnProperty('price')) {
            return;
        }

        // -->Emit: variant is being added to cart
        this.onAddingSubject$.next(variant);

        // -->Find: cart item
        let item = this.items.find((eachItem) => {
            if (eachItem.product._id === product._id && eachItem.variant.id === variant.id) {
                return true;
            }

            // if (eachItem.options.length) {
            //     for (const option of options) {
            //         if (!eachItem.options.find(itemOption => itemOption.name === option.name && itemOption.value === option.value)) {
            //             return false;
            //         }
            //     }
            // }

            return false;
        });

        if (item) {
            // -->Update: item quantity
            item.quantity += quantity;
        } else {
            item = { product, quantity, variant };

            // -->Add: item
            this.data.items.push(item);
        }

        // -->Save: and calculate
        this.save();
        this.calc();

        return of(item);
    }

    /**
     * Update: cart item quantity and total
     */
    public update(updates: { item: CartItem; quantity: number }[]): Observable<void> {
        updates.forEach((update) => {
            // -->Find: item to update
            const item = this.items.find((eachItem) => eachItem === update.item);

            // -->Check: item and update its quantity
            if (item) {
                item.quantity = update.quantity;
            }
        });

        // -->Save: and calculate
        this.save();
        this.calc();

        return EMPTY;
    }

    /**
     * Remove: item from cart
     */
    public remove(item: CartItem): Observable<void> {
        // -->Remove: item
        this.data.items = this.data.items.filter((eachItem) => eachItem !== item);

        // -->Save: and calculate
        this.save();
        this.calc();

        return EMPTY;
    }

    /**
     * Reset: cart
     */
    public clearCart(): void {
        // -->Clear: cart items
        this.data.items = [];

        // -->Save: and calculate
        this.save();
        this.calc();
    }

    /**
     * Compute: totals
     */
    private calc(): void {
        let quantity = 0;
        let subtotal = 0;

        // -->Compute: quantity and subtotal
        this.data.items.forEach(item => {
            quantity += item.quantity;
            subtotal += item.variant.price * item.quantity;
        });

        // -->Init: totals
        const totals: CartTotal[] = [];

        // todo: taxes and shipping if you are not logged in
        // totals.push({
        //     title: 'SHIPPING',
        //     price: 25,
        //     type: 'shipping',
        // });
        // totals.push({
        //     title: 'TAX',
        //     price: subtotal * 0.20,
        //     type: 'tax',
        // });

        const total = subtotal;

        // -->Update: data
        this.data.quantity = quantity;
        this.data.subtotal = subtotal;
        this.data.totals = totals;
        this.data.total = total;

        // -->Emit: data current values
        this.itemsSubject$.next(this.data.items);
        this.quantitySubject$.next(this.data.quantity);
        this.subtotalSubject$.next(this.data.subtotal);
        this.totalsSubject$.next(this.data.totals);
        this.totalSubject$.next(this.data.total);
    }

    /**
     * Save: cart items to local storage
     */
    private save(): void {
        // -->Save: items
        localStorage.setItem('cartItems', JSON.stringify(this.data.items));
    }

    /**
     * Load: cart items from local storage
     */
    private load(): void {
        // -->Load: items
        const items = localStorage.getItem('cartItems');

        // -->Check: items
        if (items) {
            // -->Parse: and set data items
            this.data.items = JSON.parse(items);
        }
    }
}
