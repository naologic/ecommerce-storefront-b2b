import {
    AfterViewInit,
    Component,
    ElementRef,
    Inject,
    NgZone,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {Router} from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import {BehaviorSubject, Subject} from 'rxjs';
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { ShopService } from '../../../shop/shop.service';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy, AfterViewInit {
    private destroy$: Subject<void> = new Subject<void>();

    public query$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    public disableSearch$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
    /**
     * TODO: when we have suggestions, uncomment everything from both html and ts files
     */
    // public suggestionsIsOpen = false;
    // public hasSuggestions = false;
    // public products: Product[] = [];
    // public categories: ShopCategory[] = [];
    // get element(): HTMLElement { return this.elementRef.nativeElement; }

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private zone: NgZone,
        private translate: TranslateService,
        private elementRef: ElementRef,
        private page: ShopService,
        private router: Router
    ) { }


    public ngOnInit(): void {
        // this.query$.pipe(
        //     distinctUntilChanged(),
        //     switchMap(query => this.shopApi.getSearchSuggestions(query, {
        //         limitProducts: 3,
        //         limitCategories: 4,
        //     })),
        //     takeUntil(this.destroy$),
        // ).subscribe(result => {
        //     if (result.products.length === 0 && result.categories.length === 0) {
        //         this.hasSuggestions = false;
        //         return;
        //     }
        //
        //     this.hasSuggestions = true;
        //     this.products = result.products;
        //     this.categories = result.categories;
        // });

        // -->Match: query to searchTerm options initially
        if (this.page.options.searchTerm) {
            this.query$.next(this.page.options.searchTerm);
        }

        // -->Subscribe: to query changes
        this.query$.pipe(distinctUntilChanged(), debounceTime(600)).subscribe(searchTerm => {
            // -->Trigger: search
            //this.page.setSearchTerm(searchTerm);
        });
    }


    public ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        // this.zone.runOutsideAngular(() => {
        //
        //     fromOutsideClick(this.element).pipe(
        //         filter(() => this.suggestionsIsOpen),
        //         takeUntil(this.destroy$),
        //     ).subscribe(() => {
        //         this.zone.run(() => this.toggleSuggestions(false));
        //     });
        //
        //     fromEvent(this.element, 'focusout').pipe(
        //         debounceTime(10),
        //         takeUntil(this.destroy$),
        //     ).subscribe(() => {
        //         if (document.activeElement === document.body) {
        //             return;
        //         }
        //
        //         // Close suggestions if the focus received an external element.
        //         if (document.activeElement && document.activeElement.closest('.search') !== this.element) {
        //             this.zone.run(() => this.toggleSuggestions(false));
        //         }
        //     });
        // });
    }


    /**
     * Emit: search term updates
     */
    public onSearchKeyUp(event: Event): void {
        const input = event.target as HTMLInputElement;

        this.query$.next(input.value);
        this.disableSearch$.next(input.value === this.page.options.searchTerm);
    }


    /**
     * Search: term and redirect
     */
    public searchAndRedirect(): void {
        // -->Redirect: to shop
        this.router.navigateByUrl('/shop').then();
        // -->Trigger: search
        this.page.setSearchTerm(this.query$.getValue());
        // -->Disable: search until query changes
        this.disableSearch$.next(true);
    }


    // /**
    //  * Toggle: suggestions
    //  */
    // public toggleSuggestions(force?: boolean): void {
    //     this.suggestionsIsOpen = force !== undefined ? force : !this.suggestionsIsOpen;
    // }


    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
