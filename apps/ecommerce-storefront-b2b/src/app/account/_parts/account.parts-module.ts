import { NgModule } from "@angular/core";
import { SharedModule } from "../../shared/shared.module";
import { AddressCardComponent } from './address-card/address-card.component';

@NgModule({
    declarations: [
        AddressCardComponent
    ],
    exports: [
        AddressCardComponent
    ],
    imports: [
        SharedModule
    ]
})
export class AccountPartsModule { }
