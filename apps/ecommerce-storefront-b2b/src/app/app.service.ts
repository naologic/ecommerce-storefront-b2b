import { Injectable, OnDestroy } from '@angular/core';
import { StorageMap } from "@ngx-pwa/local-storage";
import { BehaviorSubject, Subscription } from "rxjs";
import { NaoSettingsInterface } from "@naologic/nao-interfaces";
import { NaoUserAccessService } from "@naologic/nao-user-access";
import { ECommerceService } from "./e-commerce.service";

@Injectable({
    providedIn: 'root',
})
export class AppService implements OnDestroy {
    public readonly subs = new Subscription();
    /**
     * Global settings for ecommerce
     */
    public readonly settings = new BehaviorSubject<NaoSettingsInterface.Settings>({
        rating: false,
        freeShipping: false,
        hotOffers: false,
    });
    /**
     * All the info you need
     */
    public readonly appInfo = new BehaviorSubject<any>(null);

    constructor(
        private eCommerceService: ECommerceService,
        private readonly storageMap: StorageMap,
        private naoUsersService: NaoUserAccessService,
    ) {
        this.subs.add(
            // @ts-ignore
            this.appInfo.subscribe((info$: any) => {
                if (info$) {
                    return this.storageMap.set('uygsdf67ts76fguysdfsdf', info$).subscribe(() => {});
                }
            })
        );
        // -->Refresh: info data based on if the user is logged in
        this.subs.add(
            this.naoUsersService.isLoggedIn$.subscribe(isLoggedIn => {
                if (isLoggedIn) {
                    this.refreshInfo();
                }
            })
        );
    }

    /**
     * Refresh: info
     */
    public refreshInfo(): void {
        // -->Initial: check
        this.storageMap.get('uygsdf67ts76fguysdfsdf').subscribe((info$: any) => {
            if (Array.isArray(info$)) {
                // -->Set: app info
                this.appInfo.next(info$);
            }

            // -->Fresh: the data
            this.eCommerceService.getInfo().subscribe(info$ => {
                if (info$ && info$.ok) {
                    // -->Set: app info
                    this.appInfo.next(info$.data);
                } else {
                    // -->Emit: error
                    this.appInfo.error("The request didn't resolve correctly");
                }
            }, error => {
                // -->Emit: error
                this.appInfo.error(error);
            });
        });
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
