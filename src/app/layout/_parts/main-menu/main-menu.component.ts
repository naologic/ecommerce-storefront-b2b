import { Component } from '@angular/core';
import { MainMenuLink } from '../../../interfaces/main-menu-link';
import { mainMenu } from './main-menu.static';

@Component({
    selector: 'app-main-menu',
    templateUrl: './main-menu.component.html',
    styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent {
    public items: MainMenuLink[] = mainMenu;
    public hoveredItem: MainMenuLink|null = null;

    constructor() {}

    /**
     * Set: hovered item
     */
    public onItemEnter(item: any): void {
        this.hoveredItem = item;
    }

    /**
     * Clear: hovered item
     */
    public onItemLeave(item: any): void {
        if (this.hoveredItem === item) {
            this.hoveredItem = null;
        }
    }

    /**
     * Reset: hovered item
     */
    public onItemClick(): void {
        this.hoveredItem = null;
    }
}
