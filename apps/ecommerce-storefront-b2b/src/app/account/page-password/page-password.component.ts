import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { mustMatchValidator } from '../../shared/functions/validators/must-match';
import { AccountProfileService } from "../account-profile.service";

@Component({
    selector: 'app-page-password',
    templateUrl: './page-password.component.html',
    styleUrls: ['./page-password.component.scss'],
})
export class PagePasswordComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    public form!: FormGroup;
    public saveInProgress = false;

    constructor(
        private toastr: ToastrService,
        private translate: TranslateService,
        private fb: FormBuilder,
        private router: Router,
        private userProfileService: AccountProfileService,
    ) { }

    public ngOnInit(): void {
        this.form = this.fb.group({
            currentPassword: ['', [Validators.required, Validators.minLength(8)]],
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
        }, { validators: [mustMatchValidator('password', 'confirmPassword')] });
    }

    /**
     * Update: user password
     */
    public save(): void {
        this.form.markAllAsTouched();

        // -->Check: save action state and form
        if (this.saveInProgress || this.form.invalid) {
            return;
        }

        // -->Start: loading
        this.saveInProgress = true;

        // -->Update: user password
        this.userProfileService.updatePassword(this.form.value).subscribe(res => {
            if (res && res.ok) {
                // -->Redirect
                return this.router.navigate(['/', 'account', 'dashboard']);
            } else {
                // -->Done: loading
                this.saveInProgress = false;
                // -->Show: toaster
                this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
            }
        }, error => {
            // -->Done: loading
            this.saveInProgress = false;
            // -->Show: toaster
            this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
        })
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
