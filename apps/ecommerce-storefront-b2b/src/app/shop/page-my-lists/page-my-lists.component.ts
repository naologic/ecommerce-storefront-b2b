import { Component, OnInit } from "@angular/core";
import { MyListsService } from "../../services/my-lists.service";
import { UrlService } from "../../services/url.service";
import { BsModalService } from "ngx-bootstrap/modal";
import { EditMyListComponent } from "../_parts/edit-my-list/edit-my-list.component";

@Component({
    selector: "app-page-my-lists",
    templateUrl: "./page-my-lists.component.html",
    styleUrls: ["./page-my-lists.component.scss"],
})
export class PageMyListsComponent implements OnInit {
    public myLists: any[];

    constructor(
        public myListsService: MyListsService,
        public url: UrlService,
        private modalService: BsModalService
    ) {}

    public ngOnInit(): void {
        // -->Subscribe: to My Lists updates
        this.myListsService.myLists.subscribe((value) => {
            console.log("myLists>>>", value);
            this.myLists = value;
        });
    }

    /**
     * Create: a my list
     */
    public onCreateMyList(): void {
        // -->Open: modal
        const modalRef = this.modalService.show(EditMyListComponent, { class: "modal-lg modal-dialog-centered", })
        // -->Subscribe: to onHide
        modalRef.onHide.subscribe((value) => {
            console.warn("on create my list >>>", value);
            // todo: add loading only if the value is `done`
            // todo: stop the loading when myLists refresh is done (add a flag with loading inside)

            // -->Refresh
            this.myListsService.refresh();
        });
    }

    /**
     * Edit: a my list
     */
    public onEditMyList(list: any): void {
        console.log("list >>>", list)
        // -->Open: modal
        const modalRef = this.modalService.show(EditMyListComponent, { class: "modal-lg modal-dialog-centered", })
        // -->Subscribe: to onHide
        modalRef.onHide.subscribe((value) => {
            console.warn("on edit my list >>>", value);
            // todo: add loading only if the value is `done`
            // todo: stop the loading when myLists refresh is done (add a flag with loading inside)
            // -->Refresh
            this.myListsService.refresh();
        });
        // -->Set: content
        modalRef.content.docId = list._id;
        modalRef.content.data = list.data || {};
    }

    /**
     * Delete: a my list
     */
    public onDeleteMyList(docId: string): void {
        // todo: add loading
        // todo:
        this.myListsService.delete(docId).subscribe(res => {
            if (res && res.ok) {
                // -->Refresh
                this.myListsService.refresh();
                // -->todo: stop loading when my list service is done
            } else {
                // todo: show toaster
            }
        }, err => {
            // todo: show toaster
            // -->Show: toaster
            // this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
        })
    }
}
