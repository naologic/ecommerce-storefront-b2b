import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from '../interfaces/product';

@Injectable({
    providedIn: 'root',
})
export class QuickviewService implements OnDestroy {
    private abortPrevious$: Subject<void> = new Subject<void>();
    private showSubject$: Subject<Product> = new Subject();
    private destroy$: Subject<void> = new Subject();

    public show$: Observable<Product> = this.showSubject$.pipe(takeUntil(this.destroy$));

    /**
     * Emit: product to be shown in the quick view
     */
    public show(product: Product): Observable<void> {
        this.abortPrevious$.next();

        // -->Show: product until aborted
        return of(this.showSubject$.next(product)).pipe(takeUntil(this.abortPrevious$));
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
