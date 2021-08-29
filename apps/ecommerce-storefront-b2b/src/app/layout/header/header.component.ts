import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { NaoUserAccessService } from "@naologic/nao-user-access";
import { MyListsService } from '../../services/my-lists.service';
import { CartService } from '../../services/cart.service';
import { UrlService } from '../../services/url.service';
import { AppService } from "../../app.service";
import { DepartmentsLink } from "../../interfaces/departments-link";
import { MegamenuColumn } from "../../interfaces/menu";
import { NestedLink } from "../../interfaces/link";
import { nameToSlug } from '../../shared/functions/utils';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
    private subs = new Subscription();

    // public email$: Observable<string | null> = this.account.user$.pipe(map(x => x ? x.email : null));
    public categories: DepartmentsLink[] = [];
    public infoSupport = null;
    public userData = null;

    constructor(
        public myLists: MyListsService,
        public cart: CartService,
        public url: UrlService,
        public appService: AppService,
        private naoUsersService: NaoUserAccessService
    ) { }

    public ngOnInit(): void {
        // -->Subscribe: to appInfo changes
        this.subs.add(
            this.appService.appInfo.subscribe(value => {
                // -->Set: info
                this.infoSupport = value?.support?.supportInfo;
                // -->Set: categories
                this.categories = this.mapCategories(value?.categories?.items)

            })
        );

        // -->Subscribe: to user data
        this.naoUsersService.userData.subscribe(userData => {
            // -->Set: user data
            this.userData = userData;
        })

    }

    /**
     * Map: categories for header
     */
    public mapCategories(categories: any[]): DepartmentsLink[] {
        // -->Check: categories
        if (!Array.isArray(categories)) {
            categories = [];
        }
        // -->Init: items
        const items: DepartmentsLink[] = [];

        // -->Get: route level categories
        const rootLevelCategories = categories.filter(c => (c.parentId === 0 || c.parentId === '0') && c.level === 0);
        // -->Iterate: over categories and set the root level ones
        rootLevelCategories.forEach(category => {
            // -->Create: category
            const item: DepartmentsLink = {
                title: category.name,
                url: `/shop/category/${nameToSlug(category.name)}/${category.id}/products`
            }

            // -->Get: all second level categories for this parent
            const subCategories = categories.filter(c => c.parentId === category.id && c.level === 1);
            if (subCategories.length) {
                // -->Init: submenu
                item.submenu = {
                    type: 'megamenu',
                    size: 'xl',
                    columns: []
                };

                // -->Iterate: over subcategories and check if there are any other links inside
                subCategories.forEach(subCategory => {
                    // -->Get: links for sub category
                    const links = categories.filter(c => c.parentId === subCategory.id && c.level === 2);
                    // -->Init: column
                    const column: MegamenuColumn = {
                        size: '1of5',
                        links: []
                    }

                    // -->Create: sub category
                    const subCategory$: NestedLink = {
                        title: subCategory.name,
                        url: `/shop/category/${nameToSlug(subCategory.name)}/${subCategory.id}/products`
                    }

                    // -->Check: links
                    if (links.length) {
                        // -->Map: subcategory links
                        subCategory$.links = links.map(link => {
                            return {
                                title: link.name,
                                url: `/shop/category/${nameToSlug(link.name)}/${link.id}/products`
                            }
                        })
                    }

                    // -->Push: sub category
                    column.links.push(subCategory$);
                    // -->Push: column
                    item.submenu.columns.push(column);
                })

            }

            // -->Push: category
            items.push(item)
        });

        return items;
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
