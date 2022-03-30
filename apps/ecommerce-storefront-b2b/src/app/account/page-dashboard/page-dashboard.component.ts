import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { NaoUserAccessService, NaoUsersInterface } from "@naologic/nao-user-access";
import { UrlService } from "../../services/url.service";

@Component({
    selector: 'app-page-dashboard',
    templateUrl: './page-dashboard.component.html',
    styleUrls: ['./page-dashboard.component.scss'],
})
export class PageDashboardComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();
    private subs = new Subscription();
    // public address!: NaoUsersInterface.Address;
    public userData = null;
    public address = null;

    constructor(
        private naoUsersService: NaoUserAccessService,
        public url: UrlService,
    ) { }


    public ngOnInit(): void {
        // -->Subscribe: to userData
        this.userData = JSON.parse(localStorage.getItem('user'));
        this.subs.add(
            // this.naoUsersService.userData.subscribe( userData => {
            //     // -->Set: user data
            //     // this.userData = userData;
            //     this.userData = localStorage.getItem('user');
            //     // localStorage.setItem('user', JSON.stringify(this.userData));
            // })

        );
        this.subs.add(
            this.naoUsersService.linkedDoc.subscribe(linkedDoc => {
                // -->Check: if there is an address
                if (Array.isArray(linkedDoc?.data?.addresses) && linkedDoc.data.addresses.length) {
                    // -->Set: first address as default for nows
                    this.address = localStorage.setItem("address", JSON.stringify(linkedDoc.data.addresses[0]))
                    
                }
            })
            
        )
        this.address = JSON.parse(localStorage.getItem('address')) // 
    }


    public ngOnDestroy(): void {
        this.subs.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
