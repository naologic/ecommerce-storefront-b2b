import {Inject, Injectable, OnDestroy, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {BehaviorSubject, EMPTY, Observable, Subject, Subscription} from 'rxjs';
import {MyListToaster, Product, Variant} from "../interfaces/product";
import {NaoHttp2ApiService} from "../nao-http2";
import {NaoUserAccessService} from "../nao-user-access";
import {ToastrService} from "ngx-toastr";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root',
})
export class MyListsService implements OnDestroy {
  private apiRoot: string = 'ecommerce-api';
  private refreshSubs: Subscription;
  public myLists: BehaviorSubject<any[]> = new BehaviorSubject([] as any[]);
  public readonly count$: BehaviorSubject<number> = new BehaviorSubject(0);
  private destroy$: Subject<void> = new Subject();
  /**
   * for triggering toaster events
   */
  private onAddingSubject$: Subject<MyListToaster> = new Subject();
  private onAddedSubject$: Subject<MyListToaster> = new Subject();
  public readonly onAdding$: Observable<MyListToaster> = this.onAddingSubject$.asObservable();
  public readonly onAdded$: Observable<MyListToaster> = this.onAddedSubject$.asObservable();


  constructor(
    private readonly naoHttp2ApiService: NaoHttp2ApiService,
    private readonly naoUsersService: NaoUserAccessService,
    private toastr: ToastrService,
    private translate: TranslateService,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {
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
    // -->Set: query
    const query = {};

    // -->Execute:
    this.refreshSubs = this.list(query).subscribe(res => {
      if (res && Array.isArray(res.data)) {
        // -->Set: my lists
        this.myLists.next(res.data || []);
        // -->Set: count
        this.count$.next(res.data.length);
      } else {
        // -->Show: toaster
        this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
      }
    }, err => {
      // -->Show: toaster
      this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
    });
  }


  /**
   * Add: product to my lists
   */
  public add(listId: string, product: Product, variant: Variant): Observable<void> {
    // -->Check: product and variant
    // if (!listId || !product || !variant) {
    //   return;
    // }

    // -->Find: list
    const list = this.myLists.getValue().find(f => f.docId === listId);

    if (list.data && Array.isArray(list.data.products)) {
      // -->Create: toaster message
      const toasterMessage: MyListToaster = {
        variantName: variant.optionName,
        productName: product?.data?.name || '',
        listName: list.data.name
      }

      // -->Check: if this product + this variant already exists
      const index = list.data.products.findIndex(item => item.productId === product.docId && item.variantId === variant.id)

      if (index < 0) {
        // -->Emit: variant is being added
        this.onAddingSubject$.next(toasterMessage);
        // -->Push: new product
        list.data.products.push({productId: product.docId, variantId: variant.id})
        // -->Save:
        this.update(listId, list.data).subscribe(res => {
          if (res && res.ok) {
            // -->Refresh:
            this.refresh();
          } else {
            // -->Show: toaster
            this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
          }
        }, err => {
          // -->Show: toaster
          this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
        })
      } else {
        // -->Emit: variant was already added to my lists previously
        this.onAddedSubject$.next(toasterMessage);
      }
    }

    // -->Complete
    return EMPTY;
  }

  /**
   * List: all my lists
   */
  public list(data?, naoQueryOptions = {docName: 'productList', cfpPath: 'ecommerce/ecommerce'}): Observable<any> {
    return this.naoHttp2ApiService.postJson(`universal/ecommerce/data/search-product-lists`, {
      data: {
        data: {...(data || {})},
        naoQueryOptions
      }
    });
  }

  /**
   * Get: a single list
   */
  public get(docId: string, naoQueryOptions = {
    docName: 'productList',
    cfpPath: 'ecommerce/ecommerce'
  }): Observable<any> {
    return this.naoHttp2ApiService.postJson(`universal/ecommerce/data/get-product-list`, {
      data: {
        data: {docId},
        naoQueryOptions
      }
    });
  }

  /**
   * Update a list
   */
  public update(docId: string, data: any, naoQueryOptions = {
    docName: 'productList',
    cfpPath: 'ecommerce/ecommerce'
  }): Observable<any> {
    return this.naoHttp2ApiService.postJson(`universal/ecommerce/data/update-product-list`, {
      data: {
        data: {docId, data},
        naoQueryOptions
      }
    });
  }

  /**
   * Create a list
   */
  public create(data: any, naoQueryOptions = {
    docName: 'productList',
    cfpPath: 'ecommerce/ecommerce'
  }): Observable<any> {
    return this.naoHttp2ApiService.postJson(`universal/ecommerce/data/create-product-list`, {
      data: {
        data: {...(data || {})},
        naoQueryOptions
      }
    });
  }

  /**
   * Delete a list
   */
  public delete(docId: string, naoQueryOptions = {
    docName: 'productList',
    cfpPath: 'ecommerce/ecommerce'
  }): Observable<any> {
    return this.naoHttp2ApiService.postJson(`universal/ecommerce/data/delete-product-list`, {
      data: {
        data: {docId},
        naoQueryOptions
      }
    });
  }


  public ngOnDestroy(): void {
    if (this.refreshSubs) {
      this.refreshSubs.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
