import { ChangeDetectorRef, Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { WishlistService } from '../../services/wishlist.service';
import { Product, Variant } from '../../interfaces/product';

@Directive({
    selector: '[appAddToWishlist]',
    exportAs: 'addToWishlist',
})
export class AddToWishlistDirective implements OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    public inProgress = false;

    constructor(
        private wishlist: WishlistService,
        private cd: ChangeDetectorRef,
    ) { }

    /**
     * Add: product to wishlist
     */
    public add(product: Product, variant: Variant): void {
        // -->Check: product and if add is already in progress
        if (!product || this.inProgress) {
            return;
        }

        // -->Mark: add action as in progress
        this.inProgress = true;
        // -->Add: product to wishlist
        this.wishlist.add(product, variant).pipe(takeUntil(this.destroy$)).subscribe({
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
