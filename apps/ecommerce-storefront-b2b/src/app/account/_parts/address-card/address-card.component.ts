import { Component, Input, TemplateRef } from '@angular/core';
import { NaoUsersInterface } from "@naologic/nao-user-access";

@Component({
    selector: 'app-address-card',
    templateUrl: './address-card.component.html',
    styleUrls: ['./address-card.component.scss'],
})
export class AddressCardComponent {
    @Input() public address!: NaoUsersInterface.Address;
    @Input() public label: string = '';
    @Input() public featured = false;
    @Input() public footer?: TemplateRef<any>;
    @Input() public loading = false;

    constructor() { }
}
