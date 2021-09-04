import { NgModule } from '@angular/core';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgxPayPalModule } from 'ngx-paypal';
import { SharedModule } from '../../shared/shared.module';
import { ProductTabComponent } from './product-tab/product-tab.component';
import { ProductTabsComponent } from './product-tabs/product-tabs.component';
import { ShopSidebarComponent } from './shop-sidebar/shop-sidebar.component';
import { SpecComponent } from './spec/spec.component';
import { WidgetProductsComponent } from './widget-products/widget-products.component';
import { TermsModalComponent } from './terms-modal/terms-modal.component';
import { ArrowComponent } from './arrow/arrow.component';
import { BlockHeaderComponent } from './block-header/block-header.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SectionHeaderComponent } from './section-header/section-header.component';
import { BlockProductsCarouselComponent } from './block-products-carousel/block-products-carousel.component';
import { FilterCategoryComponent } from './filters/filter-category/filter-category.component';
import { FilterCheckComponent } from './filters/filter-check/filter-check.component';
import { FilterRadioComponent } from './filters/filter-radio/filter-radio.component';
import { FilterRangeComponent } from './filters/filter-range/filter-range.component';
import { FilterRatingComponent } from './filters/filter-rating/filter-rating.component';
import { EditMyListComponent } from './edit-my-list/edit-my-list.component';

@NgModule({
    declarations: [
        ProductTabComponent,
        ProductTabsComponent,
        ShopSidebarComponent,
        SpecComponent,
        WidgetProductsComponent,
        TermsModalComponent,
        ArrowComponent,
        BlockHeaderComponent,
        BreadcrumbComponent,
        SectionHeaderComponent,
        BlockProductsCarouselComponent,
        FilterCategoryComponent,
        FilterCheckComponent,
        FilterRadioComponent,
        FilterRangeComponent,
        FilterRatingComponent,
        EditMyListComponent
    ],
    exports: [
        ProductTabComponent,
        ProductTabsComponent,
        ShopSidebarComponent,
        SpecComponent,
        WidgetProductsComponent,
        TermsModalComponent,
        ArrowComponent,
        BlockHeaderComponent,
        BreadcrumbComponent,
        SectionHeaderComponent,
        BlockProductsCarouselComponent,
        EditMyListComponent
    ],
    imports: [
        NgxPayPalModule,
        NgxSliderModule,
        SharedModule
    ]
})
export class ShopPartsModule { }
