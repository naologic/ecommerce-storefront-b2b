import { NgModule } from '@angular/core';
import { HomeRoutingModule } from './home.routing';
import { HomePartsModule } from './_parts/home.parts-module';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';

@NgModule({
    declarations: [
        HomeComponent,
    ],
    imports: [
        HomeRoutingModule,
        HomePartsModule,
        SharedModule
    ]
})
export class HomeModule { }
