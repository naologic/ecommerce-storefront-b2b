import { Injectable, OnDestroy } from '@angular/core';
import { StorageMap } from "@ngx-pwa/local-storage";
import { BehaviorSubject, Subscription } from "rxjs";
import { NaoSettingsInterface } from "@naologic/nao-interfaces";
import { NaoUserAccessService } from "@naologic/nao-user-access";
import { ECommerceService } from "./e-commerce.service";
import { MetasInterface } from "./interfaces/metas";
import { Meta, Title } from "@angular/platform-browser";

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
        showPriceFilter: false
    });
    /**
     * All the info you need
     */
    public readonly appInfo = new BehaviorSubject<any>(null);

    constructor(
        private eCommerceService: ECommerceService,
        private readonly storageMap: StorageMap,
        private naoUsersService: NaoUserAccessService,
        public readonly titleService: Title,
        public readonly metaService: Meta,
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
            if (info$) {
                // -->Set: app info
                this.appInfo.next(info$);
                // --.Set: settings
                this.setSettings(info$)
            }

            // -->Fresh: the data
            this.eCommerceService.getInfo().subscribe(info$ => {
                if (info$ && info$.ok) {
                    // -->Set: app info
                    this.appInfo.next(info$.data);
                    // --.Set: settings
                    this.setSettings(info$.data)
                    // -->Set: Metas
                    this.setMetas({title: info$.data?.generalSettings?.metaTitle, description: info$.data?.generalSettings?.metaDescription })
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


    /**
     * Set: settings
     */
    public setSettings(info$: any): void {
        const settings = {
            rating: false,
            freeShipping: false,
            hotOffers: false,
            showPriceFilter: true
        };

        // -->Check: if has price filter
        if (info$?.generalSettings?.hasOwnProperty('showPriceFilter')) {
            settings.showPriceFilter = info$.generalSettings.showPriceFilter;
        }

        // -->Set:
        this.settings.next(settings);
    }

    /**
     * Set metas
     */
    public setMetas(metas: MetasInterface.Metas) {
        if (!metas) {
            throw new Error(`You have to send a meta tag object`);
        }
        // -->Set: title
        this.titleService.setTitle(metas.title || MetasInterface.DefaultMetas.title);
        // -->Set: description
        this.metaService.updateTag({ name: 'description', content: metas.description || MetasInterface.DefaultMetas.description });
        this.metaService.updateTag({ name: 'twitter:description', content: metas.twitterDescription || metas.description || MetasInterface.DefaultMetas.description });
        this.metaService.updateTag({ property: 'og:description', content: metas.ogDescription || metas.description || MetasInterface.DefaultMetas.description });

        // -->Check: share img
        if (metas.shareImg) {
            this.metaService.updateTag({ property: 'og:image', content: metas.shareImg });
        }
    }


    /**
     * Check: that the manufacturer exists
     */
    public checkManufacturerId(manufacturerId: string): boolean {
        if (manufacturerId && Array.isArray(this.appInfo.getValue()?.vendors)) {
            const manufacturer = this.appInfo.getValue().vendors.find(v => v._id === manufacturerId);
            // -->Return:
            return !!manufacturer;
        }
        return false;
    }

    /**
     * Check: that category exists
     */
    public checkCategoryId(categoryId: string): boolean {
        if (categoryId && Array.isArray(this.appInfo.getValue()?.categories?.items)) {
            const category = this.appInfo.getValue().categories.items.find(v => v.id === +categoryId);
            // -->Return:
            return !!category;
        }
        return false;
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
