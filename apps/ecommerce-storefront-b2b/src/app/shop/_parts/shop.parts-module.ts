import { NgModule } from '@angular/core';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxPayPalModule } from 'ngx-paypal';
import { SharedModule } from '../../shared/shared.module';
import { ProductsViewComponent } from './products-view/products-view.component';
import { ProductTabComponent } from './product-tab/product-tab.component';
import { ProductTabsComponent } from './product-tabs/product-tabs.component';
import { ShopSidebarComponent } from './shop-sidebar/shop-sidebar.component';
import { SpecComponent } from './spec/spec.component';
import { WidgetFiltersComponent } from './widget-filters/widget-filters.component';
import { WidgetProductsComponent } from './widget-products/widget-products.component';
import { NaoLoadingComponent } from "./nao-loading/nao-loading.component";
import { TermsModalComponent } from './terms-modal/terms-modal.component';
import { ArrowComponent } from './arrow/arrow.component';
import { BlockHeaderComponent } from './block-header/block-header.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SectionHeaderComponent } from './section-header/section-header.component';
import { BlockBrandsComponent } from './block-brands/block-brands.component';
import { BlockProductsCarouselComponent } from './block-products-carousel/block-products-carousel.component';
import { FilterCategoryComponent } from './filters/filter-category/filter-category.component';
import { FilterCheckComponent } from './filters/filter-check/filter-check.component';
import { FilterColorComponent } from './filters/filter-color/filter-color.component';
import { FilterRadioComponent } from './filters/filter-radio/filter-radio.component';
import { FilterRangeComponent } from './filters/filter-range/filter-range.component';
import { FilterRatingComponent } from './filters/filter-rating/filter-rating.component';

@NgModule({
    declarations: [
        ProductsViewComponent,
        ProductTabComponent,
        ProductTabsComponent,
        ShopSidebarComponent,
        SpecComponent,
        WidgetFiltersComponent,
        WidgetProductsComponent,
        NaoLoadingComponent,
        TermsModalComponent,
        ArrowComponent,
        BlockHeaderComponent,
        BreadcrumbComponent,
        SectionHeaderComponent,
        BlockBrandsComponent,
        BlockProductsCarouselComponent,
        FilterCategoryComponent,
        FilterCheckComponent,
        FilterColorComponent,
        FilterRadioComponent,
        FilterRangeComponent,
        FilterRatingComponent,
    ],
    exports: [
        ProductsViewComponent,
        ProductTabComponent,
        ProductTabsComponent,
        ShopSidebarComponent,
        SpecComponent,
        WidgetFiltersComponent,
        WidgetProductsComponent,
        NaoLoadingComponent,
        TermsModalComponent,
        ArrowComponent,
        BlockHeaderComponent,
        BreadcrumbComponent,
        SectionHeaderComponent,
        BlockBrandsComponent,
        BlockProductsCarouselComponent
    ],
    imports: [
        NgxPayPalModule,
        NgxSliderModule,
        SharedModule
    ]
})
export class ShopPartsModule { }
