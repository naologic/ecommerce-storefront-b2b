import { NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { CarouselModule } from "ngx-owl-carousel-o";
import { ModalModule } from "ngx-bootstrap/modal";
import { TooltipModule } from "ngx-bootstrap/tooltip";
import { TranslateModule } from "@ngx-translate/core";
import { CurrencyModule } from './currency/currency.module';
import { AddToCartDirective } from './directives/add-to-cart.directive';
import { AddToCompareDirective } from './directives/add-to-compare.directive';
import { AddToMyListsDirective } from './directives/add-to-my-lists.directive';
import { DropdownDirective } from './directives/dropdown.directive';
import { FakeSlidesDirective } from './directives/fake-slides.directive';
import { OwlPreventClickDirective } from './directives/owl-prevent-click.directive';
import { RemoveFromCartDirective } from './directives/remove-from-cart.directive';
import { RemoveFromCompareDirective } from './directives/remove-from-compare.directive';
import { SplitStringDirective } from './directives/split-string.directive';
import { ShowIfLoggedInDirective } from "./directives/show-if-logged-in.directive";
import { CollapseItemDirective } from './directives/collapse-item.directive';
import { CollapseContentDirective } from './directives/collapse-content.directive';
import { CheckboxGroupDirective } from './directives/checkbox-group.directive';
import { RadioGroupDirective } from './directives/radio-group.directive';
import { ActiveFilterLabelPipe } from './pipes/active-filter-label.pipe';
import { GetProductImagePipe } from './pipes/get-product-image.pipe';
import { HasErrorPipe } from './pipes/has-error.pipe';
import { IsInvalidPipe } from './pipes/is-invalid.pipe';
import { StockToStatusBadgeTextPipe } from './pipes/stock-to-status-badge-text.pipe';
import { StockToStatusBadgeTypePipe } from './pipes/stock-to-status-badge-type.pipe';
import { CheckImageFallbackPipe } from "./pipes/check-image-fallback.pipe";
import { IconComponent } from './icon/icon.component';
import { InputNumberComponent } from './input-number/input-number.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductVariantsComponent } from './product-variants/product-variants.component';
import { ProductGalleryComponent } from './product-gallery/product-gallery.component';
import { RatingComponent } from './rating/rating.component';
import { StatusBadgeComponent } from './status-badge/status-badge.component';
import { TermsComponent } from './terms/terms.component';
import { AvatarIconComponent } from "./avatar-icon/avatar-icon.component";
import { CheckboxComponent } from './checkbox/checkbox.component';
import { RadioButtonComponent } from './radio-button/radio-button.component';
import { SanitizeHtmlPipe } from "./pipes/saniteze-html.pipe";
import { BlockBrandsComponent } from "./block-brands/block-brands.component";
import { NaoLoadingComponent } from "./nao-loading/nao-loading.component";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        CarouselModule,
        ModalModule.forChild(),
        TooltipModule,
        TranslateModule.forChild(),
        CurrencyModule
    ],
    declarations: [
        AddToCartDirective,
        AddToCompareDirective,
        AddToMyListsDirective,
        DropdownDirective,
        FakeSlidesDirective,
        OwlPreventClickDirective,
        RemoveFromCartDirective,
        RemoveFromCompareDirective,
        SplitStringDirective,
        ShowIfLoggedInDirective,
        CollapseItemDirective,
        CollapseContentDirective,
        CheckboxGroupDirective,
        RadioGroupDirective,
        ActiveFilterLabelPipe,
        GetProductImagePipe,
        HasErrorPipe,
        IsInvalidPipe,
        StockToStatusBadgeTextPipe,
        StockToStatusBadgeTypePipe,
        CheckImageFallbackPipe,
        IconComponent,
        InputNumberComponent,
        PaginationComponent,
        ProductCardComponent,
        ProductVariantsComponent,
        ProductGalleryComponent,
        RatingComponent,
        StatusBadgeComponent,
        TermsComponent,
        AvatarIconComponent,
        CheckboxComponent,
        RadioButtonComponent,
        SanitizeHtmlPipe,
        BlockBrandsComponent,
        NaoLoadingComponent
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        CarouselModule,
        ModalModule,
        TranslateModule,
        CurrencyModule,
        AddToCartDirective,
        AddToCompareDirective,
        AddToMyListsDirective,
        DropdownDirective,
        FakeSlidesDirective,
        OwlPreventClickDirective,
        RemoveFromCartDirective,
        RemoveFromCompareDirective,
        SplitStringDirective,
        ShowIfLoggedInDirective,
        CollapseItemDirective,
        CollapseContentDirective,
        CheckboxGroupDirective,
        RadioGroupDirective,
        ActiveFilterLabelPipe,
        GetProductImagePipe,
        HasErrorPipe,
        IsInvalidPipe,
        StockToStatusBadgeTextPipe,
        StockToStatusBadgeTypePipe,
        CheckImageFallbackPipe,
        IconComponent,
        InputNumberComponent,
        PaginationComponent,
        ProductCardComponent,
        ProductVariantsComponent,
        ProductGalleryComponent,
        RatingComponent,
        StatusBadgeComponent,
        TermsComponent,
        AvatarIconComponent,
        CheckboxComponent,
        RadioButtonComponent,
        SanitizeHtmlPipe,
        BlockBrandsComponent,
        NaoLoadingComponent
    ]
})
export class SharedModule { }
