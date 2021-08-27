import { ChangeDetectorRef, Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { Product, Variant } from '../../interfaces/product';

@Directive({
    selector: '[appAddToCart]',
    exportAs: 'addToCart',
})
export class AddToCartDirective implements OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    public inProgress = false;

    constructor(
        private cart: CartService,
        private cd: ChangeDetectorRef,
    ) { }

    /**
     * Add: product variant to cart
     */
    public add(product: Product, variant: Variant, quantity: number = 1): void {
        // -->Check: product, variant and if add is already in progress
        if (!product || !variant || this.inProgress) {
            return;
        }

        // -->Mark: add action as in progress
        this.inProgress = true;
        // -->Add: product variant to cart
        this.cart.add(product, variant, quantity).pipe(takeUntil(this.destroy$)).subscribe({
            complete: () => {
                // -->Mark: add action as completed
                this.inProgress = false;
                // -->Mark: as changed
                this.cd.markForCheck();
            },
        });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
