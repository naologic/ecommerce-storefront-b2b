import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { MyListsService } from '../../services/my-lists.service';
import { CartService } from '../../services/cart.service';
import { UrlService } from '../../services/url.service';
import { AppService } from "../../app.service";
import { DepartmentsLink } from "../../interfaces/departments-link";
import { MegamenuColumn } from "../../interfaces/menu";
import { NestedLink } from "../../interfaces/link";
import { nameToSlug } from '../../shared/functions/utils';
import { Router } from '@angular/router';
import { Product } from '../../interfaces/product';
import { NaoUserAccessService } from '../../../../../../libs/nao-user-access/src';

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
    loggedInUser: string;
    public variantIndex = 0;
    public product!: Product;
    public isLoggedIn = false;

    constructor(
        public myLists: MyListsService,
        public cart: CartService,
        public url: UrlService,
        public appService: AppService,
        private naoUsersService: NaoUserAccessService,
        private router: Router,
    ) { }

    public ngOnInit(): void {
        this.isLoggedIn = this.naoUsersService.isLoggedIn();
        this.userData = localStorage.getItem("user");
        if(this.userData == null)
        {
            this.isLoggedIn = false;
        }
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
        this.userData = JSON.parse(localStorage.getItem('user'))
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
      /**
     * Log: user LoggedIn
     */
    loggedIn() {
        this.loggedInUser = localStorage.getItem('user')
        return this.loggedInUser;
    }
     /**
     * Log: user out and redirect
     */
   public logout(): void {
    // -->Logout: user
    this.naoUsersService.logout().then(() => {
        localStorage.clear();
        this.cart.clearCart();
        // -->Redirect
        this.router.navigateByUrl('/account/login').then();
    });
    
}

public ngOnChanges(changes: SimpleChanges): void {
    // -->Subscribe: to userData
    this.subs.add(
        this.naoUsersService.userData.subscribe(userData => {
            // -->Set: user data
            this.userData = userData;
            console.log(this.userData,'userData');
            
        })
    );
}
    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
