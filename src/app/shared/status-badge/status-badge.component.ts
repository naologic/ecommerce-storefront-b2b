import { Component, Input } from '@angular/core';

export type StatusBadgeType = 'success' | 'failure' | 'warning' | 'unknown';

export type StatusBadgeIcon = 'success' | 'failure';

@Component({
    selector: 'app-status-badge',
    templateUrl: './status-badge.component.html',
    styleUrls: ['./status-badge.component.scss'],
})
export class StatusBadgeComponent {
    @Input() public type: StatusBadgeType = 'unknown';
    @Input() public icon: StatusBadgeIcon|false = false;
    @Input() public text: string = '';
    @Input() public tooltipContent: string = '';

    constructor() { }
}
