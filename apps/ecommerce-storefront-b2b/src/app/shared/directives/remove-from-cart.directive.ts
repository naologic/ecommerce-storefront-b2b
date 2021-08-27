import { ChangeDetectorRef, Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../interfaces/cart';

@Directive({
    selector: '[appRemoveFromCart]',
    exportAs: 'removeFromCart',
})
export class RemoveFromCartDirective implements OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    public inProgress = false;

    constructor(
        private cart: CartService,
        private cd: ChangeDetectorRef,
    ) { }

    /**
     * Remove: item from cart
     */
    public remove(item: CartItem): void {
        // -->Check: if remove action is already in progress
        if (this.inProgress) {
            return;
        }

        // -->Mark: remove action as in progress
        this.inProgress = true;
        // -->Remove: item from cart
        this.cart.remove(item).pipe(takeUntil(this.destroy$)).subscribe({
            complete: () => {
                // -->Mark: remove action as completed
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
