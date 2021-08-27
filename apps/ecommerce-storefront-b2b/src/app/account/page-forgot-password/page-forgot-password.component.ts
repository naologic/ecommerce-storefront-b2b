import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { NaoUserAccessService } from "@naologic/nao-user-access";
import { AccountProfileService } from "../account-profile.service";

@Component({
    selector: 'app-page-forgot-password',
    templateUrl: './page-forgot-password.component.html',
    styleUrls: ['./page-forgot-password.component.scss'],
})
export class PageForgotPasswordComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    public formGroup!: FormGroup;
    public resetInProgress = false;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private naoUsersService: NaoUserAccessService,
        private toastr: ToastrService,
        private translate: TranslateService,
        private userProfileService: AccountProfileService,
    ) {
    }


    public ngOnInit(): void {
        this.formGroup = this.fb.group({
            email: [null, [Validators.required, Validators.email]],
        });
    }


    /**
     * Reset: user password
     */
    public resetPassword(): void {
        this.formGroup.markAllAsTouched();

        // -->Check: reset action state and form
        if (this.resetInProgress || this.formGroup.invalid) {
            return;
        }
        // -->Get: formGroup data
        const fd = this.formGroup.getRawValue();
        // -->Start: loading
        this.resetInProgress = true;
        // -->Execute: a login
        this.userProfileService
            .sendResetPasswordEmail(fd.email)
            .subscribe((res) => {
                // -->Done: loading
                this.resetInProgress = false;
                // -->Redirect
                // return this.router.navigate(['/', 'account', 'dashboard']);
            }, (err) => {
                // -->Done: loading
                this.resetInProgress = false;

                // -->Show: toaster
                this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));

                this.formGroup.reset();
            });
    }


    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
