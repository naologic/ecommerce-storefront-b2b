import { EventEmitter, Inject, Injectable, PLATFORM_ID, TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

export interface OpenPanelEvent {
    label: string;
    content: TemplateRef<any>;
}

@Injectable({
    providedIn: 'root',
})
export class LayoutMobileMenuService {
    private isOpenSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    public onOpenPanel: EventEmitter<OpenPanelEvent> = new EventEmitter<OpenPanelEvent>();
    public onCloseCurrentPanel: EventEmitter<void> = new EventEmitter<void>();

    public get isOpen(): boolean {
        return this.isOpenSubject.value;
    }

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
    ) { }

    /**
     * Open: mobile menu
     */
    public open(): void {
        this.toggle(true);
    }

    /**
     * Close: mobile menu
     */
    public close(): void {
        this.toggle(false);
    }

    /**
     * Toggle: mobile menu
     */
    private toggle(force?: boolean): void {
        // -->Set: isOpen
        const isOpen = force !== undefined ? force : !this.isOpenSubject.value;

        // -->Check: if isOpen already has the desired value
        if (isOpen === this.isOpenSubject.value) {
            return;
        }

        if (isPlatformBrowser(this.platformId)) {
            if (isOpen) {
                const bodyWidth = document.body.offsetWidth;

                // -->Update: styles for when mobile menu is open
                document.body.style.overflow = 'hidden';
                document.body.style.paddingRight = (document.body.offsetWidth - bodyWidth) + 'px';
            } else {
                // -->Update: styles for when mobile menu is closed
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            }

            this.isOpenSubject.next(isOpen);
        }
        else {
            this.isOpenSubject.next(isOpen);
        }
    }

    /**
     * Open: mobile menu panel
     */
    public openPanel(label: string, panelContent: TemplateRef<any>): void {
        this.onOpenPanel.emit({ label, content: panelContent });
    }

    /**
     * Close: current mobile menu panel
     */
    public closeCurrentPanel(): void {
        this.onCloseCurrentPanel.next();
    }
}
