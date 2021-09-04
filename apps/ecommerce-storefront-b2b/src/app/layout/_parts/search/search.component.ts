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
import { ShopProductService } from "../../../shop/shop-product.service";

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy, AfterViewInit {
    private destroy$: Subject<void> = new Subject<void>();

    public query$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    public disableSearch$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private zone: NgZone,
        private translate: TranslateService,
        private elementRef: ElementRef,
        private shopProductService: ShopProductService,
        private router: Router
    ) { }


    public ngOnInit(): void {

        // -->Match: query to searchTerm options initially
        if (this.shopProductService.options.searchTerm) {
            this.query$.next(this.shopProductService.options.searchTerm);
        }

        // -->Subscribe: to search terrm change
        this.shopProductService.optionsChange$.pipe(distinctUntilChanged(), debounceTime(200)).subscribe(value => {
            if (value?.searchTerm) {
                this.query$.next(value.searchTerm);
            } else {
                this.query$.next(null);
            }
        })
    }


    public ngAfterViewInit(): void {
        if (!isPlatformBrowser(this.platformId)) {
            return;
        }
    }


    /**
     * Emit: search term updates
     */
    public onSearchKeyUp(event: Event): void {
        const input = event.target as HTMLInputElement;

        this.query$.next(input.value);
        this.disableSearch$.next(input.value === this.shopProductService.options.searchTerm);
    }


    /**
     * Search: term and redirect
     */
    public searchAndRedirect(): void {
        // -->Check: if the current route starts with shop
        if(!this.router.url?.startsWith('/shop/category')) {
            // -->Redirect: to shop
            this.router.navigateByUrl('/shop').then();
        }
        // -->Trigger: search
        this.shopProductService.setSearchTerm(this.query$.getValue());
        // -->Disable: search until query changes
        this.disableSearch$.next(true);
    }


    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
