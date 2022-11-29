import { ChangeDetectorRef, Directive, OnDestroy, OnInit } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { CartService } from "../../services/cart.service";
import { Product, Variant } from "../../interfaces/product";
import { NaoUserAccessService } from "@naologic/nao-user-access";

@Directive({
    selector: "[appAddToCart]",
    exportAs: "addToCart",
})
export class AddToCartDirective implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();
    public inProgress = false;
    private subs = new Subscription();
    private isLoggedIn = false;

    constructor(private cart: CartService, private cd: ChangeDetectorRef, private naoUsersService: NaoUserAccessService) {}

    public ngOnInit(): void {
        // -->Subscribe: to logged in and disable the button
        this.subs.add(
            this.naoUsersService.isLoggedIn$.subscribe((isLoggedIn) => {
                this.isLoggedIn = isLoggedIn;
            }),
        );
    }

    /**
     * Add: product variant to cart
     */
    public add(product: Product, variant: Variant, quantity: number = 1): void {
        // -->Check: product, variant and if add is already in progress
        if (!product || !variant || this.inProgress || !this.isLoggedIn) {
            return;
        }

        // -->Mark: add action as in progress
        this.inProgress = true;
        // -->Add: product variant to cart
        this.cart
            .add(product, variant, quantity)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                complete: () => {
                    // -->Mark: add action as completed
                    this.inProgress = false;
                    // -->Mark: as changed
                    this.cd.markForCheck();
                },
            });
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
