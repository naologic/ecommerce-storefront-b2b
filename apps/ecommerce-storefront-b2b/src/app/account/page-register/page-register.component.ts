import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { NaoUserAccessService } from "@naologic/nao-user-access";
import { AccountAuthService } from "../account-auth.service";
import { mustMatchValidator } from '../../shared/functions/validators/must-match';
import { checkPasswordStrength } from '../../shared/functions/validators/password-strength';

@Component({
    selector: 'app-page-register',
    templateUrl: './page-register.component.html',
    styleUrls: ['./page-register.component.scss'],
})
export class PageRegisterComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    public formGroup!: FormGroup;
    public registerInProgress = false;
    public registerDone = false;
    public errorMessage = null;

    constructor(
        private fb: FormBuilder,
        private router: Router,
        private naoUsersService: NaoUserAccessService,
        private naoUsersAuthService: AccountAuthService,
    ) { }

    public ngOnInit(): void {
        this.formGroup = this.fb.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required, Validators.minLength(8), checkPasswordStrength()]],
            firstName: [null, [Validators.required]],
            lastName: [null, [Validators.required]],
            // companyName: [null, [Validators.required]],
            phoneNo: [null, [Validators.required]],
            confirmPassword: [null, [Validators.required, Validators.minLength(8)]],
        }, { validators: [mustMatchValidator('password', 'confirmPassword')] });
    }

    /**
     * Register: new user
     */
    public register(): void {
        // -->Mark: all controls
        this.formGroup.markAllAsTouched();

        // -->Check: register action state and form
        if (this.registerInProgress || this.formGroup.invalid) {
            return;
        }

        // -->Get: data
        const data = this.formGroup.getRawValue();
        // -->Start: loading
        this.registerInProgress = true;

        // -->Create: new user
        this.naoUsersAuthService.createUser(data).subscribe(
            (ok) => {
                // -->Done: loading
                this.registerInProgress = false;
                this.registerDone = true;
            },
            (err) => {
                // -->Set: error message
                switch (err?.error?.index) {
                    case 'duplicate_user':
                        this.errorMessage = 'DUPLICATED_ACCOUNT';
                        break;
                    default:
                        this.errorMessage = 'ERROR_API_REQUEST';
                }
                // -->Done: loading
                this.registerInProgress = false;
                // -->Mark: as pristine
                this.formGroup.markAsPristine();
            }
        );
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
