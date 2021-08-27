import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ShopSidebarService {
    private isOpenState = false;
    private isOpenSubject: Subject<boolean> = new Subject();

    public isOpen$: Observable<boolean> = this.isOpenSubject.asObservable();

    public get isOpen(): boolean {
        return this.isOpenState;
    }
    public set isOpen(value: boolean) {
        if (this.isOpenState !== value) {
            this.isOpenState = value;
            this.isOpenSubject.next(value);
        }
    }

    constructor() { }

    /**
     * Open: sidebar
     */
    public open(): void {
        this.isOpen = true;
    }

    /**
     * Close: sidebar
     */
    public close(): void {
        this.isOpen = false;
    }

    /**
     * Toggle: sidebar
     */
    public toggle(): void {
        this.isOpen = !this.isOpen;
    }
}
