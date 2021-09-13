import { Component, OnDestroy, OnInit } from "@angular/core";
import { NaoSettingsInterface } from "@naologic/nao-interfaces";
import { MyListsService } from '../../services/my-lists.service';
import { UrlService } from '../../services/url.service';
import { AppService } from "../../app.service";
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from "rxjs";
import { ToastrService } from "ngx-toastr";
import { takeUntil } from "rxjs/operators";
import { CartService } from "../../services/cart.service";
import { checkIfProductIsAvailable } from "../../shared/utils";

@Component({
    selector: 'app-page-my-list',
    templateUrl: './page-my-list.component.html',
    styleUrls: ['./page-my-list.component.scss'],
})
export class PageMyListComponent implements OnInit, OnDestroy {
    private refreshSubs: Subscription;
    public docId: string;
    public inProgress = true;
    public data: any = null;
    public appSettings: NaoSettingsInterface.Settings;

    constructor(
        public myListsService: MyListsService,
        public url: UrlService,
        private appService: AppService,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private translate: TranslateService,
        private cart: CartService,
    ) { }

    public ngOnInit(): void {
        // -->Set: app settings
        this.appSettings = this.appService.settings.getValue();
        // -->subscribe: to params change
        this.route.params.subscribe(params => {
            // -->Set: my list id
            this.docId = params.id;
            // -->Get: and refresh items
            this.refresh();
        }
        );
    }

    /**
     * Refresh: items on list
     */
    public refresh(): void {
        // -->Check: refresh subscriptions
        if (this.refreshSubs) {
            this.refreshSubs.unsubscribe();
        }
        // -->Start: loading
        this.inProgress = true;

        // -->Execute
        this.myListsService.get(this.docId).subscribe((res) => {
            if (res && res.data) {
                // -->Set: data
                this.data = res.data;
            } else {
                // -->Show: toaster
                this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
            }
            // -->Done: loading
            this.inProgress = false;

        }, err => {
            // -->Done: loading
            this.inProgress = false;
            // -->Show: toaster
            this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
        });
    }

    /**
     * Remove: product
     */
    public remove(index: number): void {
        // -->Check
        if (this.inProgress || !Array.isArray(this.data.products)) {
            return;
        }

        // -->Get: list
        const list = this.myListsService.myLists?.getValue().find(f => f._id === this.docId);
        if (!list) {
            return;
        }

        // -->Mark: as in progress
        this.inProgress = true;

        // -->Check: if product exists
        if (this.data.products[index]) {
            // -->Remove: product
            this.data.products.splice(index, 1);
            list.data.products.splice(index, 1);
            // -->Save:
            this.myListsService.update(this.docId, list.data).subscribe(res => {
                if (res && res.ok) {

                } else {
                    // -->Show: toaster
                    this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
                }
                // -->Done:
                this.inProgress = false;
            }, err => {
                // -->Done:
                this.inProgress = false;
                // -->Show: toaster
                this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
            })
        }
    }

    /**
     * Add: list to cart
     */
    public addListToCart(): void {
        if (!this.data?.products?.length){
            return
        }

        // -->Iterate: over products:
        this.data?.products.map(item => {
            // -->Check: that this is available
            // if (checkIfProductIsAvailable(item?.product?.data?.availability, item.product?.data?.available)) {
                // -->Add: to cart
                this.cart.add(item.product, item.variant, 1).subscribe();
            // }
        })
    }

    /**
     * On destroy
     */
    public ngOnDestroy(): void {
        if (this.refreshSubs) {
            this.refreshSubs.unsubscribe();
        }
    }
}
