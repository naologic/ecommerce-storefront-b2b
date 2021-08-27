import { ChangeDetectorRef, Directive, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MyListsService } from '../../services/my-lists.service';

@Directive({
    selector: '[appAddToMyLists]',
    exportAs: 'addToMyLists',
})
export class AddToMyListsDirective implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();
    public inProgress = false;
    public myLists = [];
    public subs = new Subscription();

    constructor(
        private myListsService: MyListsService,
        private cd: ChangeDetectorRef,
    ) { }

    public ngOnInit() {
        // -->Subscribe: to my lists changes
        this.subs.add(
            this.myListsService.myLists.subscribe(value => {
                this.myLists = Array.isArray(value) ? value : [];
            })
        )
    }

    /**
     * Add: product to myLists
     */
    public add(listId: string, productId: string, variantId: string): void {
        console.log("adding to myLists directive >>>>", {listId, productId, variantId})
        // -->Check: product and if add is already in progress
        if (!listId || !productId || !variantId || this.inProgress) {
            return;
        }

        // todo: @barbara: check if that product/variant already exists in the selected list
        //          > if it exists, show the toaster and then return

        // -->Mark: add action as in progress
        this.inProgress = true;
        // -->Add: product to myLists
        this.myListsService.add(listId, productId, variantId).pipe(takeUntil(this.destroy$)).subscribe({
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
