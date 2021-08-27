import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Subject, Subscription } from 'rxjs';
import { QuickMongoQuery } from "@naologic/nao-utils";
import { UrlService } from '../../services/url.service';
import { ECommerceService } from "../../e-commerce.service";

@Component({
    selector: 'app-page-orders',
    templateUrl: './page-invoices.component.html',
    styleUrls: ['./page-invoices.component.scss'],
})
export class PageInvoicesComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();
    private refreshSubs = new Subscription();

    public currentPage: FormControl = new FormControl(1);
    public list: { items: any[], pages: number } = { items: [], pages: 0};
    public perPage = 20;

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

        // -->Create: query
        const query = new QuickMongoQuery()
            .limit(this.perPage)
            .skip((this.currentPage.value - 1) * this.perPage)
            .returnDataModel({_id: 1, data: 1, info: 1, fullData: 1})
            .done();

        // -->Execute: query to get invoice list
        this.refreshSubs = this.eCommerceService.listInvoices(query).subscribe(res => {
            if (res && Array.isArray(res.data)) {
                // -->Set: invoices
                this.list = {
                    items: res.data || [],
                    pages: Math.ceil(res.meta.totalHits / this.perPage)
                }
            } else {
                // -->Show: toaster
                this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
            }
        }, err => {
            // -->Show: toaster
            this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
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
