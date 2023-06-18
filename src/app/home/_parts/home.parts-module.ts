import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { BlockFeaturesComponent } from './block-features/block-features.component';
import { FeaturedProductsGridComponent } from './featured-products-grid/featured-products-grid.component';

@NgModule({
    declarations: [
        BlockFeaturesComponent,
        FeaturedProductsGridComponent
    ],
    exports: [
        BlockFeaturesComponent,
        FeaturedProductsGridComponent
    ],
    imports: [
        SharedModule
    ]
})
export class HomePartsModule { }
