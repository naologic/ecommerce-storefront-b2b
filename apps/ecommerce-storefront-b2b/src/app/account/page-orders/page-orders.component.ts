import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Subject, Subscription } from 'rxjs';
import { QuickMongoQuery } from "@naologic/nao-utils";
import { UrlService } from '../../services/url.service';
import { ECommerceService } from "../../e-commerce.service";
import {first} from "rxjs/operators";

@Component({
    selector: 'app-page-orders',
    templateUrl: './page-orders.component.html',
    styleUrls: ['./page-orders.component.scss'],
})
export class PageOrdersComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();
    private refreshSubs = new Subscription();

    public currentPage: FormControl = new FormControl(1);
    public list: { items: any[], pages: number } = { items: [], pages: 0};
    public perPage = 100;

    public isLoading = false;
    public linkIsLoading = false;

    constructor(
        public url: UrlService,
        public eCommerceService: ECommerceService,
        private toastr: ToastrService,
        private translate: TranslateService,
    ) {
    }

    public ngOnInit(): void {
        // -->Refresh
        this.refresh();
        // -->Subscribe: to value changes
        this.currentPage.valueChanges.subscribe(page => {
            this.refresh();
        })
    }

    /**
     * Refresh: invoice list
     */
    public refresh(): void {
        // -->Check: refresh subscriptions
        if (this.refreshSubs) {
            this.refreshSubs.unsubscribe();
            this.refreshSubs = null;
        }

        // -->Set: is loading
        this.isLoading = true;

        // -->Create: query
        const query = new QuickMongoQuery()
            .limit(this.perPage)
            .skip((this.currentPage.value - 1) * this.perPage)
            .returnDataModel({docId: 1, data: 1, info: 1, fullData: 1})
            .done();

        // -->Execute: query to get invoice list
        this.refreshSubs = this.eCommerceService.listOrders(query).subscribe(res => {
            if (res && Array.isArray(res.data)) {
                // -->Set: orders
                this.list = {
                    items: res.data || [],
                    pages: Math.ceil((res.meta.totalDocuments || 0) / this.perPage)
                }

            } else {
                // -->Show: toaster
                this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
            }
            // -->Set: is loading
            this.isLoading = false;
        }, err => {
            // -->Show: toaster
            this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
            // -->Set: is loading
            this.isLoading = false;
        })
    }


    /**
     * Refresh: invoice list
     */
    public getPublicLink(docId: string): void {
        if (this.linkIsLoading) {
            return;
        }
        if (!docId) {
            // -->Show: toaster
            this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
            return;
        }

        // -->Start: loading for links
        this.linkIsLoading = true;

        // -->Execute: query to get invoice list
        this.refreshSubs = this.eCommerceService.getOrderInformation(docId)
            .pipe(first())
            .subscribe(res => {
                if (typeof res?.data?.link === 'string' && res?.data?.link) {
                    // -->Open: link
                    this.url.openLinkInNewTab(res.data.link);
                } else {
                    // -->Show: toaster
                    this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
                }
                // -->Set: is loading
                this.linkIsLoading = false;

            }, err => {
                // -->Show: toaster
                this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
                // -->Set: is loading
                this.linkIsLoading = false;
            })
    }

    public ngOnDestroy(): void {
        if (this.refreshSubs) {
            this.refreshSubs.unsubscribe();
        }
        this.destroy$.next();
        this.destroy$.complete();
    }
}
