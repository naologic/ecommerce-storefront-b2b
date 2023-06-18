import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { Subject, Subscription } from "rxjs";
import { MyListsService } from "../../../services/my-lists.service";
import { BsModalService } from "ngx-bootstrap/modal";

@Component({
    selector: "app-edit-my-list",
    templateUrl: "./edit-my-list.component.html",
    styleUrls: ["./edit-my-list.component.scss"],
})
export class EditMyListComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();
    private subs = new Subscription();
    public formGroup = this.newMyListForm();
    public docId: string | null = null;
    public data = null;

    public saveInProgress = false;

    constructor(
        private toastr: ToastrService,
        private translate: TranslateService,
        private myListsService: MyListsService,
        private modalService: BsModalService
    ) {}

    public ngOnInit(): void {
        setTimeout(() => {
            // -->Set: formGroup
            this.formGroup = this.newMyListForm(this.data);
        })
    }

    /**
     * Save: address to user profile
     */
    public save(): void {
        this.formGroup.markAllAsTouched();
        // -->Check: save action state and form
        if (this.saveInProgress || this.formGroup.invalid) {
            return;
        }
        // -->Start: loading
        this.saveInProgress = true;

        // -->Get: fg
        const data = this.formGroup.getRawValue();

        // -->Set: single doc rule
        let o$;
        // -->Update: doc
        if (this.docId) {
            o$ = this.myListsService.update(this.docId, data);
        } else {
            o$ = this.myListsService.create(data);
        }

        // -->Update
        o$.subscribe(
            (res) => {
                if (res && res.ok) {
                    // -->Done: loading
                    this.saveInProgress = false;
                    // -->Close: modal
                    this.modalService.setDismissReason("done");
                    this.modalService.hide();
                } else {
                    // -->Done: loading
                    this.saveInProgress = false;
                    // -->Show: toaster
                    this.toastr.error(
                        this.translate.instant("ERROR_API_REQUEST")
                    );
                }
            },
            (error) => {
                // -->Done: loading
                this.saveInProgress = false;
                // -->Show: toaster
                this.toastr.error(this.translate.instant("ERROR_API_REQUEST"));
            }
        );
    }

    /**
     * FormGroup
     */
    public newMyListForm(data?): FormGroup {
        const fg = new FormGroup({
            name: new FormControl(null, { validators: [Validators.required] }),
            products: new FormArray([]),
        });
        if (data) {
            fg.patchValue(data);

            if (Array.isArray(data.products)) {
                data.products.map((p, i) => {
                    (fg.get("products") as FormArray).push(
                        this.newMyListProductForm(p)
                    );
                });
            }
        }
        return fg;
    }

    /**
     * FormGroup products
     */
    public newMyListProductForm(data?): FormGroup {
        const fg = new FormGroup({
            variantId: new FormControl(null, {
                validators: [Validators.required],
            }),
            productId: new FormControl(null, {
                validators: [Validators.required],
            }),
        });
        if (data) {
            fg.patchValue(data);
        }
        return fg;
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
