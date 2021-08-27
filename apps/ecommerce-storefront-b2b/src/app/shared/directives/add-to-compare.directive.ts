import { ChangeDetectorRef, Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CompareService } from '../../services/compare.service';
import { Product, Variant } from '../../interfaces/product';

@Directive({
    selector: '[appAddToCompare]',
    exportAs: 'addToCompare',
})
export class AddToCompareDirective implements OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    public inProgress = false;

    constructor(
        private compare: CompareService,
        private cd: ChangeDetectorRef
    ) { }

    /**
     * Add: product and variant to compare
     */
    public add(product: Product, variant: Variant): void {
        // -->Check: product, variant and if add is already in progress
        if (!product || !variant || this.inProgress) {
            return;
        }

        // -->Mark: add action as in progress
        this.inProgress = true;
        // -->Add: product variant to compare
        this.compare.add(product, variant).pipe(takeUntil(this.destroy$)).subscribe({
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
