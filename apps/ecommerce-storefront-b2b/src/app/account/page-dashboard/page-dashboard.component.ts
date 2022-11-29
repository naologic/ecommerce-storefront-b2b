import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { NaoUserAccessService, NaoUsersInterface } from "@naologic/nao-user-access";
import { UrlService } from "../../services/url.service";
import { AccountAuthService } from "../account-auth.service";

@Component({
    selector: 'app-page-dashboard',
    templateUrl: './page-dashboard.component.html',
    styleUrls: ['./page-dashboard.component.scss'],
})
export class PageDashboardComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();
    private subs = new Subscription();
    public address!: NaoUsersInterface.Address;
    public userData = null;

    constructor(
        private readonly accountAuthService: AccountAuthService,
        private readonly naoUsersService: NaoUserAccessService,
        public readonly url: UrlService,
    ) { }


    public ngOnInit(): void {
        // -->Subscribe: to userData
        this.subs.add(
            this.naoUsersService.userData.subscribe(userData => {
                // -->Set: user data
                this.userData = userData;
            })
        );
        // -->Subscribe: to linkedDoc
        this.subs.add(
            this.naoUsersService.linkedDoc.subscribe(linkedDoc => {
                // -->Check: if there is an address
                if (Array.isArray(linkedDoc?.data?.addresses) && linkedDoc.data.addresses.length) {
                    // -->Set: first address as default for now
                    this.address = linkedDoc.data.addresses[0];
                }
            })
        )

        this.accountAuthService.ensureUserData({})
            .subscribe(ok => {

            })
    }

    public ensureUserData() {

    }


    public ngOnDestroy(): void {
        this.subs.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
