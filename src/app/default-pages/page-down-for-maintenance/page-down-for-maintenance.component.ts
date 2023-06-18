import { Component, Input } from "@angular/core";

@Component({
    selector: 'app-page-down-for-maintenance',
    templateUrl: './page-down-for-maintenance.component.html',
    styleUrls: ['./page-down-for-maintenance.component.scss'],
})
export class PageDownForMaintenanceComponent {
    @Input() public downForMaintenanceMessage: string = '';

    constructor() { }
}
