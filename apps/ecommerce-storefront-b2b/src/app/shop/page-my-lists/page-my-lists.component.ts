import { Component, OnInit } from "@angular/core";
import { MyListsService } from "../../services/my-lists.service";
import { UrlService } from "../../services/url.service";
import { BsModalService } from "ngx-bootstrap/modal";
import { EditMyListComponent } from "../_parts/edit-my-list/edit-my-list.component";
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: "app-page-my-lists",
    templateUrl: "./page-my-lists.component.html",
    styleUrls: ["./page-my-lists.component.scss"],
})
export class PageMyListsComponent implements OnInit {
    public myLists: any[];
    public refreshInProgress = true;

    constructor(
        public myListsService: MyListsService,
        public url: UrlService,
        private modalService: BsModalService,
        private toastr: ToastrService,
        private translate: TranslateService,
    ) {}

    public ngOnInit(): void {
        // -->Subscribe: to My Lists updates
        this.myListsService.myLists.subscribe((value) => {
            // -->Check: value
            if (value) {
                // -->Set: myLists
                this.myLists = value;
                // -->Done: loading
                this.refreshInProgress = false;
            }
        });

        // -->Refresh
        this.myListsService.refresh();
    }

    /**
     * Create: a my list
     */
    public onCreateMyList(): void {
        // -->Open: modal
        const modalRef = this.modalService.show(EditMyListComponent, { class: "modal-md modal-dialog-centered", })
        // -->Subscribe: to onHide
        modalRef.onHide.subscribe((value) => {
            // -->Check: value
            if (value === 'done'){
                // -->Start: loading
                this.refreshInProgress = true;
                // -->Refresh
                this.myListsService.refresh();
            }
        });
    }

    /**
     * Edit: a my list
     */
    public onEditMyList(list: any): void {
        if (!list._id || !list.data) {
            return
        }
        // -->Open: modal
        const modalRef = this.modalService.show(EditMyListComponent, { class: "modal-md modal-dialog-centered", })
        // -->Set: content
        modalRef.content.docId = list._id;
        modalRef.content.data = list.data || {};
        // -->Subscribe: to onHide
        modalRef.onHide.subscribe((value) => {
            // -->Check: value
            if (value === 'done'){
                // -->Start: loading
                this.refreshInProgress = true;
                // -->Refresh
                this.myListsService.refresh();
            }
        });
    }

    /**
     * Delete: a my list
     */
    public onDeleteMyList(docId: string, index: number): void {
        if (!docId && index > -1) {
            return;
        }
        // -->Start: loading
        this.refreshInProgress = true;
        // -->Execute:
        this.myListsService.delete(docId).subscribe(res => {
            if (res && res.ok) {
                // -->Split: my lists
                this.myLists.slice(index, 1);
                // -->Refresh
                this.myListsService.refresh();
            } else {
                // -->Show: toaster
                this.toastr.success(this.translate.instant('TEXT_TOAST_PRODUCT_REMOVED_FROM_MY_LISTS'));
            }
        }, err => {
            // -->Show: toaster
            this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
        })
    }
}
