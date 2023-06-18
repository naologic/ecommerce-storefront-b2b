import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { PageProductLayout } from '../../page-product/page-product.component';
// import { ReviewsListComponent } from '../reviews-list/reviews-list.component';

@Component({
    selector: 'app-reviews-view',
    templateUrl: './reviews-view.component.html',
    styleUrls: ['./reviews-view.component.scss'],
})
export class ReviewsViewComponent implements OnInit, OnDestroy {
    @Input() public productId!: number;
    @Input() public productPageLayout: PageProductLayout = 'full';

    private destroy$: Subject<void> = new Subject<void>();

    public submitInProgress = false;
    public form!: FormGroup;

    // @ViewChild(ReviewsListComponent) list!: ReviewsListComponent;

    constructor(
        private fb: FormBuilder,
        private toastr: ToastrService,
        private translate: TranslateService
    ) { }

    public ngOnInit(): void {
        this.form = this.fb.group({
            rating: ['', [Validators.required]],
            author: ['', [Validators.required]],
            email: ['', [Validators.required, Validators.email]],
            content: ['', [Validators.required]],
        });
    }

    /**
     * Submit: product review
     */
    public submit(): void {
        this.form.markAllAsTouched();

        // -->Check: form is valid
        if (this.submitInProgress || this.form.invalid) {
            return;
        }

        // this.submitInProgress = true;

        // const formValue = this.form.value;

        // this.shop.addProductReview(this.productId, {
        //     rating: parseFloat(formValue.rating),
        //     author: formValue.author,
        //     email: formValue.email,
        //     content: formValue.content,
        // }).pipe(
        //     finalize(() => this.submitInProgress = false),
        //     takeUntil(this.destroy$),
        // ).subscribe(() => {
        //     this.form.reset({
        //         rating: '',
        //         author: '',
        //         email: '',
        //         content: '',
        //     });
        //     this.list.reload();
        //     this.toastr.success(this.translate.instant('TEXT_TOAST_REVIEW_ADDED'));
        // });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
