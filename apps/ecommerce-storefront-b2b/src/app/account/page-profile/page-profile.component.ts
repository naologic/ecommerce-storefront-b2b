import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from "@angular/router";
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Subject, Subscription } from 'rxjs';
import { NaoUserAccessService } from "@naologic/nao-user-access";
import { AccountProfileService } from "../account-profile.service";
import { NaoUserAccessData } from "../../../../../../libs/nao-user-access/src";
import { AppService } from "../../app.service";
import { accountData$ } from "../../../app.static";
import { AppInterface } from "../../../app.interface";

@Component({
    selector: 'app-page-profile',
    templateUrl: './page-profile.component.html',
    styleUrls: ['./page-profile.component.scss'],
})
export class PageProfileComponent implements OnInit, OnDestroy {
    public formGroupUserAccount!: FormGroup;
    public formGroupCompanyAccount!: FormGroup;
    public saveInProgress = false;
    /**
     * User: data
     */
    public userData;
    /**
     * Account data information
     */
    public accountData!: AppInterface.AccountData;
    /**
     * Subscriptions
     */
    private destroy$: Subject<void> = new Subject<void>();
    private subs = new Subscription();

    constructor(
        private readonly appService: AppService,
        private readonly fb: FormBuilder,
        private readonly toastr: ToastrService,
        private readonly router: Router,
        private readonly translate: TranslateService,
        private readonly userProfileService: AccountProfileService,
        private readonly naoUsersService: NaoUserAccessService,
    ) { }

    public ngOnInit(): void {
        // -->Get: userData
        this.userData = this.naoUsersService.userData.getValue();
        // -->Set: account information
        this.accountData = accountData$.getValue();

        // -->Check: and redirect
        if (!this.userData || !this.userData) {
            this.router.navigateByUrl('/account/login').then();
            return;
        }

        // -->Subscribe: to userData
        this.subs.add(
            this.naoUsersService.userData.subscribe(userData => {
                // -->Set: user data
                this.userData = userData;
            })
        );

        // -->Subscribe: to account data
        this.subs.add(
            accountData$.subscribe(accountData => {
                // -->Set: account information
                this.accountData = accountData;
                // -->Set: form
                this.setForm()
            })
        );
        // -->Set: form
        this.setForm()
    }


    /**
     * Set: form
     */
    public setForm(): void {
        // -->Set: form group user account
        this.formGroupUserAccount = this.fb.group({
            firstName: [this.userData.firstName, [Validators.required]],
            lastName: [this.userData.lastName, [Validators.required]],
            phoneNo: [this.userData.phoneNo],
        });
        // -->Set: form group company account
        this.formGroupCompanyAccount = this.fb.group({
            name: [this.accountData?.name],
            contactName: [this.accountData?.contactName],
            phoneNumber: [this.accountData?.phoneNumber],
            email: [this.accountData?.email],
            website: [this.accountData?.website],
        });
    }

    /**
     * Update: user profile data
     */
    public save(type: 'userAccount' | 'companyAccount'): void {
        // -->Check: save action state and form
        if (this.saveInProgress){
            return;
        }

        let data
        if (type === 'userAccount') {
            if (this.formGroupUserAccount.invalid) {
                return;
            }
            // -->Mark: all controls
            this.formGroupUserAccount.markAllAsTouched();
            // -->Set: data
            data = this.formGroupUserAccount.getRawValue();
        } else {
            if (this.formGroupCompanyAccount.invalid) {
                return;
            }
            // -->Mark: all controls
            this.formGroupCompanyAccount.markAllAsTouched();
            // -->Set: data
            data = this.formGroupCompanyAccount.getRawValue();
        }

        // -->Start: loading
        this.saveInProgress = true;


        // -->Update: user profile
        this.userProfileService.updateAccountData(type, { data, docId: NaoUserAccessData.userId.getValue() }).subscribe(res => {
            if (res && res.ok) {
                // -->Refresh: session data
                this.appService.getAccountDataInformation().then(res => {
                    // -->Done: loading
                    this.saveInProgress = false;
                    // -->Show: toaster
                    this.toastr.success(this.translate.instant('TEXT_TOAST_PROFILE_SAVED'));
                }).catch(err => {
                    // -->Done: loading
                    this.saveInProgress = false;
                    // -->Show: toaster
                    this.toastr.error(this.translate.instant('ERROR_API_REQUEST'));
                })
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
        this.subs.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
