import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription} from 'rxjs';
import { NaoUserAccessService } from "@naologic/nao-user-access";

@Component({
    selector: 'app-account-menu',
    templateUrl: './account-menu.component.html',
    styleUrls: ['./account-menu.component.scss'],
})
export class AccountMenuComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();
    private subs = new Subscription();

    public userData = null;
    public formGroup!: FormGroup;
    public loginInProgress = false;
    public errorMessage = 'INVALID_LOGIN';
    public errorMessageExtraData = {};

    @Output() public closeMenu: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private fb: FormBuilder,
        public router: Router,
        private naoUsersService: NaoUserAccessService,
    ) {
    }

    public ngOnInit(): void {
        this.subs.add(
            this.naoUsersService.userData.subscribe(userData => {
                // -->Set: user data
                this.userData = userData;
            })
        );

        this.formGroup = this.fb.group({
            email: [null, [Validators.required, Validators.email]],
            password: [null, [Validators.required]],
        });
    }

    /**
     * Login: user
     */
    public login(): void {
        // -->Mark: all controls
        this.formGroup.markAllAsTouched();

        // -->Check: login action state and form
        if (this.loginInProgress || this.formGroup.invalid) {
            return;
        }

        // -->Get: formGroup data
        const fd = this.formGroup.getRawValue();

        // -->Start: loading
        this.loginInProgress = true;
        // -->Execute: login
        this.naoUsersService
            .loginWithEmail(fd.email, fd.password, true)
            .then((res) => {
                // -->Done: loading
                this.loginInProgress = false;
                this.closeMenu.emit();
                // -->Redirect
                return this.router.navigate(['/', 'account', 'dashboard']);
            })
            .catch((err) => {
                // -->Set: error message
                switch (err?.error?.index) {
                    case 'user_too_many_login_attempts':
                        this.errorMessage = 'TOO_MANY_TRIES';
                        this.errorMessageExtraData = { number: err?.error?.minutes || 30};
                        break;
                    case 'user_activation_required':
                        this.errorMessage = 'PENDING_ACCOUNT';
                        break;
                    default:
                        this.errorMessage = 'INVALID_LOGIN';
                }
                // -->Done: loading
                this.loginInProgress = false;
                // -->Reset: password form control
                this.formGroup.get('password').reset();
                this.formGroup.get('password').markAllAsTouched();
                this.formGroup.get('password').updateValueAndValidity();
            });
    }

    /**
     * Logout: user
     */
    public logout(): void {
        // -->Execute: logout
        this.naoUsersService.logout().then(() => {
            this.closeMenu.emit();
            // -->Redirect
            return this.router.navigateByUrl('/account/login');
        });
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
