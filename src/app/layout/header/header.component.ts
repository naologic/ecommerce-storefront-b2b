import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { NaoUserAccessService } from "../../nao-user-access";
import { MyListsService } from "../../services/my-lists.service";
import { CartService } from "../../services/cart.service";
import { UrlService } from "../../services/url.service";
import { AppService } from "../../app.service";
import { DepartmentsLink } from "../../interfaces/departments-link";
import { MegamenuColumn } from "../../interfaces/menu";
import { NestedLink } from "../../interfaces/link";
import { nameToSlug } from "../../shared/functions/utils";
import { appInfo$ } from "../../../app.static";

@Component({
    selector: "app-header",
    templateUrl: "./header.component.html",
    styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit, OnDestroy {
    private subs = new Subscription();

    // public email$: Observable<string | null> = this.account.user$.pipe(map(x => x ? x.email : null));
    /**
     * Categories
     */
    public categories: DepartmentsLink[] = [];
    /**
     * Info support for phone number and email address
     */
    public infoSupport = null;
    /**
     * User data
     */
    public userData = null;

    constructor(public myLists: MyListsService, public cart: CartService, public url: UrlService, public appService: AppService, private naoUsersService: NaoUserAccessService) {}

    public ngOnInit(): void {
        // -->Subscribe: to appInfo changes
        this.subs.add(
            appInfo$.subscribe((value) => {
                // -->Set: info
                this.infoSupport = {
                    supportPhoneNumber: value?.shopInfo?.support?.data?.supportPhoneNumber || "",
                    supportEmailAddress: value?.shopInfo?.support?.data?.supportEmailAddress || "",
                };
                // -->Set: categories
                this.categories = this.mapCategories(value?.categories);
            }),
        );

        // -->Subscribe: to user data
        this.naoUsersService.userData.subscribe((userData) => {
            // -->Set: user data
            this.userData = userData;
        });
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
        const rootLevelCategories = categories.filter((c) => !c?.data?.parentId);

        // -->Iterate: over categories and set the root level ones
        rootLevelCategories.forEach((category) => {
            // -->Check: if the category has the right fields
            if (!category?.data?.name || !category?.docId) {
                return;
            }

            // -->Create: category
            const item: DepartmentsLink = {
                title: category.data.name,
                url: `/shop/category/${nameToSlug(category.data.name)}/${category.docId}/products`,
            };

            /**
             * Get: second level categories for this parent
             */
            const subCategories = categories.filter((c) => c.data?.parentId === category.docId);
            if (subCategories.length) {
                // -->Init: submenu
                item.submenu = {
                    type: "megamenu",
                    size: "xl",
                    columns: [],
                };

                // -->Iterate: over subcategories and check if there are any other links inside
                subCategories.forEach((subCategory) => {
                    /**
                     * Get: links for sub category
                     */
                    const links = categories.filter((c) => c.data?.parentId === category.docId);
                    // -->Init: column
                    const column: MegamenuColumn = {
                        size: "1of5",
                        links: [],
                    };

                    // -->Check: if the category has the right fields
                    if (!subCategory?.data?.name || !subCategory?.docId) {
                        return;
                    }

                    // -->Create: sub category
                    const subCategory$: NestedLink = {
                        title: subCategory.data.name,
                        url: `/shop/category/${nameToSlug(subCategory.data.name)}/${subCategory.docId}/products`,
                    };

                    // -->Check: links
                    if (links.length) {
                        // -->Map: subcategory links that have a name
                        subCategory$.links = links
                            .filter((link: any) => link?.data?.name && link?.docId)
                            .map((link) => {
                                return {
                                    title: link.data.name,
                                    url: `/shop/category/${nameToSlug(link.data.name)}/${link.docId}/products`,
                                };
                            });
                    }

                    // -->Push: sub category
                    column.links.push(subCategory$);
                    // -->Push: column
                    item.submenu.columns.push(column);
                });
            }

            // -->Push: category
            items.push(item);
        });

        return items;
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
