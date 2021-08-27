import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NaoUserAccessService } from "@naologic/nao-user-access";

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    public navigation: { label: string; url: string; }[] = [];

    constructor(
        private translate: TranslateService,
        private router: Router,
        private naoUsersService: NaoUserAccessService,
    ) { }

    public ngOnInit(): void {
        this.initNavigation();
        this.translate.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => this.initNavigation());
    }

    /**
     * Log: user out and redirect
     */
    public logout(): void {
        // -->Logout: user
        this.naoUsersService.logout().then(() => {
            // -->Redirect
            this.router.navigateByUrl('/account/login').then();
        });
    }

    /**
     * Initialize: navigation items
     */
    private initNavigation(): void {
        this.navigation = [
            { label: this.translate.instant('LINK_ACCOUNT_DASHBOARD'), url: '/account/dashboard' },
            { label: this.translate.instant('LINK_ACCOUNT_PROFILE'), url: '/account/profile' },
            { label: this.translate.instant('LINK_ACCOUNT_INVOICE'), url: '/account/invoices' },
            { label: this.translate.instant('LINK_ACCOUNT_ADDRESSES'), url: '/account/addresses' },
            { label: this.translate.instant('LINK_ACCOUNT_PASSWORD'), url: '/account/password' },
        ];
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
