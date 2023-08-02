import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { AccountMenuComponent } from "./account-menu/account-menu.component";
import { HeaderMenuAllCategoriesComponent } from "./header-menu-all-categories/header-menu-all-categories.component";
import { DropcartComponent } from "./dropcart/dropcart.component";
import { IndicatorComponent } from "./indicator/indicator.component";
import { LogoComponent } from "./logo/logo.component";
import { MegamenuComponent } from "./megamenu/megamenu.component";
import { MenuComponent } from "./menu/menu.component";
import { SearchComponent } from "./search/search.component";
import { TopBarComponent } from "./topbar/top-bar.component";
import { MobileHeaderComponent } from "./mobile-header/mobile-header.component";
import { MobileMenuComponent } from "./mobile-menu/mobile-menu.component";
import { MobileMenuLinksComponent } from "./mobile-menu-links/mobile-menu-links.component";
import { MobileMenuPanelComponent } from "./mobile-menu-panel/mobile-menu-panel.component";
import { LoadingBarComponent } from "./loading-bar/loading-bar.component";
import { QuickViewComponent } from "./quickview/quick-view.component";
import {
  HeaderMenuIndividualCategoryComponent
} from "./header-menu-individual-category/header-menu-individual-category.component";


@NgModule({
  declarations: [
    AccountMenuComponent,
    HeaderMenuAllCategoriesComponent,
    HeaderMenuIndividualCategoryComponent,
    DropcartComponent,
    IndicatorComponent,
    LogoComponent,
    MegamenuComponent,
    MenuComponent,
    SearchComponent,
    TopBarComponent,
    MobileHeaderComponent,
    MobileMenuComponent,
    MobileMenuLinksComponent,
    MobileMenuPanelComponent,
    LoadingBarComponent,
    QuickViewComponent
  ],
  exports: [
    AccountMenuComponent,
    HeaderMenuAllCategoriesComponent,
    HeaderMenuIndividualCategoryComponent,
    DropcartComponent,
    IndicatorComponent,
    LogoComponent,
    MegamenuComponent,
    MenuComponent,
    SearchComponent,
    TopBarComponent,
    MobileHeaderComponent,
    MobileMenuComponent,
    MobileMenuLinksComponent,
    MobileMenuPanelComponent,
    LoadingBarComponent,
    QuickViewComponent
  ],
  imports: [
    SharedModule
  ]
})
export class LayoutPartsModule {
}
