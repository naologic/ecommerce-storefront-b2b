import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { UrlService } from '../../services/url.service';
import { CartItem } from '../../interfaces/cart';

@Component({
    selector: 'app-page-cart',
    templateUrl: './page-cart.component.html',
    styleUrls: ['./page-cart.component.scss'],
})
export class PageCartComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject();
    private items: CartItem[] = [];

    public quantityControls: FormControl[] = [];
    public updating = false;

    constructor(
        public cart: CartService,
        public url: UrlService,
    ) { }

    public ngOnInit(): void {
        // -->Subscribe: to cart items changes
        this.cart.items$.pipe(takeUntil(this.destroy$)).subscribe(items => {
            // -->Set: items
            this.items = items;
            // -->Update: items quantity control
            this.quantityControls = items.map(item => new FormControl(item.quantity));
        });
    }

    /**
     * Update: cart items
     */
    public update(): void {
        // -->Init: entries
        const entries = [];

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const quantityControl = this.quantityControls[i];

            // -->Build: and push entry with item and quantity value
            if (item.quantity !== quantityControl.value) {
                entries.push({
                    item,
                    quantity: quantityControl.value,
                });
            }
        }

        // -->Check: entries length
        if (entries.length <= 0) {
            return;
        }

        // -->Start: loading
        this.updating = true;

        // -->Update: cart items
        this.cart.update(entries).pipe(takeUntil(this.destroy$)).subscribe({
            complete: () => {
                // -->Done: loading
                this.updating = false;
            }
        });
    }


    /**
     * Check: if update is needed
     */
    public needUpdate(): boolean {
        let needUpdate = false;

        // -->Check: items and quantities to determine if update is needed
        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            const quantityControl = this.quantityControls[i];

            if (!quantityControl.valid) {
                return false;
            }

            if (quantityControl.value !== item.quantity) {
                needUpdate = true;
            }
        }

        return needUpdate;
    }


    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
