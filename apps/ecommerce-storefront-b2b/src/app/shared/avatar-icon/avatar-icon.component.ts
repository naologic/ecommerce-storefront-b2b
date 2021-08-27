import {Component, Input, SimpleChanges} from '@angular/core';

@Component({
    selector: 'app-avatar-icon',
    templateUrl: './avatar-icon.component.html',
    styleUrls: ['./avatar-icon.component.scss'],
})
export class AvatarIconComponent {
    @Input() public userData;
    @Input() public size: 'sm' | 'md' = 'sm';
    @Input() public initials = 'U';

    constructor() { }

    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.userData) {
            // -->Get: initials
            this.initials = this.userData?.firstName?.charAt(0) + this.userData?.lastName?.charAt(0);
        }
    }
}
