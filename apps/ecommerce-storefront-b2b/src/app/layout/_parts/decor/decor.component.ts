import { Component, Input } from '@angular/core';

export type DecorComponentType = 'center' | 'bottom';

@Component({
    selector: 'app-decor',
    templateUrl: './decor.component.html',
    styleUrls: ['./decor.component.scss'],
})
export class DecorComponent {
    @Input() public type: DecorComponentType = 'center';

    constructor() { }
}
