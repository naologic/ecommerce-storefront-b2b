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
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  /**
   * All categories used for more menu
   */
  public allCategories: DepartmentsLink[] = [];
  /**
   * Featured: categories
   * TODO: @WIP
   */
  public featuredCategories: DepartmentsLink[] = [];
  /**
   * Info support for phone number and email address
   */
  public infoSupport = null;
  /**
   * User data
   */
  public userData = null;


  private subs = new Subscription();

  constructor(public myLists: MyListsService, public cart: CartService, public url: UrlService, public appService: AppService, private naoUsersService: NaoUserAccessService) {
  }

  public ngOnInit(): void {
    // -->Subscribe: to appInfo changes
    this.subs.add(
      appInfo$.subscribe((value) => {
        // -->Set: categories
        this.initCategoriesForMore(value?.categories);
        // -->Get: featured categories ids
        let featuredCategoryIds = []
        if (Array.isArray(value?.shopInfo?.navigationAndFooter?.data?.featuredHeaderCategories)) {
          featuredCategoryIds = value.shopInfo.navigationAndFooter.data.featuredHeaderCategories.map(f => f.categoryId).filter(f => f);
        }
        // -->Init: featured categories
        this.initFeaturedCategories(value?.categories, featuredCategoryIds);
      })
    );

    // -->Subscribe: to user data
    this.subs.add(
      this.naoUsersService.userData.subscribe((userData) => {
        // -->Set: user data
        this.userData = userData;
      })
    );
  }


  /**
   * Init: featured categories
   */
  private initFeaturedCategories(categories: any[], featuredCategoryIds: string[]): void {
    // -->Check: categories
    if (!Array.isArray(categories) || !Array.isArray(featuredCategoryIds) || !featuredCategoryIds.length) {
      categories = [];
    }
    // -->Init
    let items: any = [];
    /**
     * Check: if this is a mega menu, mega menu column or a plain link
     */
    featuredCategoryIds.forEach(categoryId => {
      // -->Get: category
      const category = categories.find(f => f.docId === categoryId);
      // -->Check: if the category has the right fields
      if (category?.data?.name && category?.docId) {
        // -->Create: category
        const item: DepartmentsLink = {
          title: category.data.name,
          url: this.createCategoryLink(category.data.name, category.docId)
        };

        /**
         * Get: second level categories for this parent
         */
        const subCategories = categories.filter((c) => c.data?.parentId === category.docId);
        if (subCategories.length) {
          // -->Init: submenu
          item.submenu = {
            type: "megamenu",
            size: "full-width",
            columns: []
          };

          // -->Iterate: over subcategories and check if there are any other links inside
          subCategories.forEach((subCategory) => {
            /**
             * Get: links for sub category
             */
            const links = categories.filter((c) => c.data?.parentId === subCategory.docId);
            // -->Init: column
            const column: MegamenuColumn = {
              size: "1of5",
              links: []
            };

            // -->Check: if the category has the right fields
            if (subCategory?.data?.name && subCategory?.docId) {
              // -->Create: sub category
              const subCategory$: NestedLink = {
                title: subCategory.data.name,
                url: this.createCategoryLink(subCategory.data.name, subCategory.docId)
              };

              // -->Check: links
              if (links.length) {
                // -->Map: subcategory links that have a name
                subCategory$.links = links
                  .filter((link: any) => link?.data?.name && link?.docId)
                  .map((link) => {
                    return {
                      title: link.data.name,
                      url: this.createCategoryLink(link.data.name, link.docId)
                    };
                  });
              }
              // -->Push: sub category
              column.links.push(subCategory$);
            }
            // -->Push: column
            item.submenu.columns.push(column);
          });
        }
        // -->Push: category
        items.push(item);
      }
    });


    /**
     * Iterate: over items and check if we have a menu item with only 2 levels and shrink everything
     */
    items = items.map(item => {
      // -->Check: if the element doesn't have the third level of nesting (only 2)
      if (!this.hasThirdLevelNesting(item)) {
        // -->Check: if it's a plain routerlink or it has a submenu
        if (Array.isArray(item?.submenu?.columns) && item?.submenu?.columns?.length) {
          // -->Get: all the links
          const links = this.getLinksFromColumns(item);
          // -->Convert: it to a small menu
          item.submenu = {
            type: "megamenu",
            size: "single-dropdown",
            columns: [
              {
                size: "1",
                links
              }
            ]
          };
        }
      }

      return item;
    })
    // -->Set: featured categories
    this.featuredCategories = items;
  }


  /**
   * Init: categories for more
   */
  private initCategoriesForMore(categories: any[]): void {
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
        url: this.createCategoryLink(category.data.name, category.docId)
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
          columns: []
        };

        // -->Iterate: over subcategories and check if there are any other links inside
        subCategories.forEach((subCategory) => {
          /**
           * Get: links for sub category
           */
          const links = categories.filter((c) => c.data?.parentId === subCategory.docId);
          // -->Init: column
          const column: MegamenuColumn = {
            size: "1of5",
            links: []
          };

          // -->Check: if the category has the right fields
          if (!subCategory?.data?.name || !subCategory?.docId) {
            return;
          }
          // -->Create: sub category
          const subCategory$: NestedLink = {
            title: subCategory.data.name,
            url: this.createCategoryLink(subCategory.data.name, subCategory.docId)
          };

          // -->Check: links
          if (links.length) {
            // -->Map: subcategory links that have a name
            subCategory$.links = links
              .filter((link: any) => link?.data?.name && link?.docId)
              .map((link) => {
                return {
                  title: link.data.name,
                  url: this.createCategoryLink(link.data.name, link.docId)
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

    this.allCategories = items;
  }


  /**
   * Check: if it has the third level of nesting
   */
  private hasThirdLevelNesting(menuItem: DepartmentsLink) {
    if (menuItem?.submenu && Array.isArray(menuItem.submenu.columns)) {
      for (const column of menuItem.submenu.columns) {
        if (column.links) {
          for (const link of column.links) {
            if (link.links) {
              return true;
            }
          }
        }
      }
    }
    return false;
  }

  /**
   * Get: all the links from inside columns
   */
  private getLinksFromColumns(menuItem: DepartmentsLink): NestedLink[] {
    const links: NestedLink[] = [];
    if (menuItem?.submenu && Array.isArray(menuItem.submenu.columns)) {
      for (const column of menuItem.submenu.columns) {
        if (column.links) {
          for (const link of column.links) {
            links.push(link);
          }
        }
      }
    }
    return links;
  }


  /**
   * Create: link for a category
   */
  private createCategoryLink(name: string, docId: string): string {
    return `/shop/category/${nameToSlug(name)}/${docId}/products`;
  }



  public ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
