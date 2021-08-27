import { Inject, Injectable, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, EMPTY, Observable, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product, Variant, ProductVariant } from '../interfaces/product';
import { NaoDocumentInterface } from "@naologic/nao-interfaces";
import { NaoHttp2ApiService } from "@naologic/nao-http2";
import { NaoUserAccessService } from "@naologic/nao-user-access";
import { ToastrService } from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
    providedIn: 'root',
})
export class MyListsService implements OnDestroy {
    private apiRoot: string = 'ecommerce-api';
    private refreshSubs: Subscription;
    public myLists: BehaviorSubject<any[]> = new BehaviorSubject([
        {_id: 123123, data: { name: 'list 1'}},
        {_id: 12312334, data: { name: 'list 2'}},
        {_id: 12312334, data: { name: 'list 3'}}
    ]);
    /**
     * todo: Count should be the total number of my lists or? @Oliver
     */
    public readonly count$: BehaviorSubject<number> = new BehaviorSubject(0);

    private dataItems: ProductVariant[] = [];
    private destroy$: Subject<void> = new Subject();
    private itemsSubject$: BehaviorSubject<ProductVariant[]> = new BehaviorSubject<ProductVariant[]>([]);
    private onAddingSubject$: Subject<Variant> = new Subject();
    private onAddedSubject$: Subject<Variant> = new Subject();

    public readonly items$: Observable<ProductVariant[]> = this.itemsSubject$.pipe(takeUntil(this.destroy$));
    public readonly onAdding$: Observable<Variant> = this.onAddingSubject$.asObservable();
    public readonly onAdded$: Observable<Variant> = this.onAddedSubject$.asObservable();





    constructor(
        private readonly naoHttp2ApiService: NaoHttp2ApiService,
        private readonly naoUsersService: NaoUserAccessService,
        private toastr: ToastrService,
        private translate: TranslateService,
        @Inject(PLATFORM_ID) private platformId: any,
    ) {
        console.error("constructor wishlist >>>")
        if (isPlatformBrowser(this.platformId)) {
            this.naoUsersService.isLoggedIn$.subscribe(isLoggedIn => {
                if (isLoggedIn) {
                    this.refresh();
                }
            })
        }
    }


    /**
     * Refresh: and get all my lists
     */
    public refresh(): void {
        // -->Check: refresh subscriptions
        if (this.refreshSubs) {
            this.refreshSubs.unsubscribe();
        }

        // -->Execute:
        this.refreshSubs = this.list({}).subscribe(res => {
            console.log("my lists response >>>>", res)
            if (res && Array.isArray(res.data)) {
                // -->Set: my lists
                this.myLists = res.data || [];
                // -->Set: count
                this.count$.next(res.data.length);
            } else {
                // -->Show: toaster
                this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
            }
        }, err => {
            // -->Show: toaster
            this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
        })
    }


    /**
     * Add: product to wishlist
     */
    public add(listId: string, productId: string, variantId: string): Observable<void> {
        console.log("adding to wishlist >>>>", {listId, productId, variantId})
        // -->Check: product and variant
        if (!listId || !productId || !variantId) {
            return;
        }

        // todo: check if it's logegd in

        // todo: get list

        // todo: update the list

        //
        // // -->Find: index
        // const index = this.dataItems.findIndex(item => item.product._id === product._id && item.variant.id === variant.id);
        //
        // // -->Check: if product variant is already on the wishlist
        // if (index === -1) {
        //     // -->Emit: variant is being added
        //     this.onAddingSubject$.next(variant);
        //
        //     // -->Add: wishlist item
        //     this.dataItems.push({ product, variant });
        //     // -->Save
        //     this.save();
        // }
        // else {
        //     // -->Emit: variant was already added to wishlist previously
        //     this.onAddedSubject$.next(variant);
        // }

        // -->Complete
        return EMPTY;
    }

    /**
     * Add: product to wishlist
     * todo: delet this
     */
    public addOld(product: Product, variant: Variant): Observable<void> {
        // -->Check: product and variant
        if (!product || !variant) {
            return;
        }

        // -->Find: index
        const index = this.dataItems.findIndex(item => item.product._id === product._id && item.variant.id === variant.id);

        // -->Check: if product variant is already on the wishlist
        if (index === -1) {
            // -->Emit: variant is being added
            this.onAddingSubject$.next(variant);

            // -->Add: wishlist item
            this.dataItems.push({ product, variant });
            // -->Save
            this.save();
        }
        else {
            // -->Emit: variant was already added to wishlist previously
            this.onAddedSubject$.next(variant);
        }

        // -->Complete
        return EMPTY;
    }

    /**
     * Remove: product from wishlist
     */
    public remove(wishlistItem: ProductVariant): Observable<void> { //ProductVariant
        // -->Check: if product is on the wishlist
        const index = this.dataItems.findIndex(item =>
            item.product._id === wishlistItem.product._id && item.variant.id === wishlistItem.variant.id);

        // -->Remove: product and save
        if (index !== -1) {
            this.dataItems.splice(index, 1);
            this.save();
        }

        // -->Complete
        return EMPTY;
    }

    /**
     * Save: wishlist items to local storage
     */
    private save(): void {
        localStorage.setItem('wishlistItems', JSON.stringify(this.dataItems));

        // -->Emit: items
        this.itemsSubject$.next(this.dataItems);
    }

    /**
     * Load: wishlist items from local storage
     */
    private load(): void {
        const items = localStorage.getItem('wishlistItems');

        // -->Check: items
        if (items) {
            // -->Parse: and set wishlist items
            this.dataItems = JSON.parse(items);
            // -->Emit: items
            this.itemsSubject$.next(this.dataItems);
        }
    }


    /**
     * List: all my lists
     */
    public list(data?, naoQueryOptions = NaoDocumentInterface.naoQueryOptionsDefault({ docName: 'myList' })): Observable<any> {
        return this.naoHttp2ApiService.postJson<any>(`${this.apiRoot}/data/list/${naoQueryOptions.docName}/filter`, { data, naoQueryOptions });
    }


    /**
     * Get: a single list
     */
    public get(docId: string, naoQueryOptions = NaoDocumentInterface.naoQueryOptionsDefault({ docName: 'myList' })): Observable<any> {
        return this.naoHttp2ApiService.postJson<any>(`${this.apiRoot}/data/get/${naoQueryOptions.docName}/data`, { data: { docId }, naoQueryOptions });
    }


    /**
     * Update a list
     */
    public update(docId: string, data: any, naoQueryOptions = NaoDocumentInterface.naoQueryOptionsDefault({ docName: 'myList' })): Observable<any> {
        return this.naoHttp2ApiService.putJson<any>(`${this.apiRoot}/data/update/${naoQueryOptions.docName}/id`, { data: { docId, data }, naoQueryOptions });
    }


    public ngOnDestroy(): void {
        if (this.refreshSubs) {
            this.refreshSubs.unsubscribe();
        }
        this.destroy$.next();
        this.destroy$.complete();
    }
}
