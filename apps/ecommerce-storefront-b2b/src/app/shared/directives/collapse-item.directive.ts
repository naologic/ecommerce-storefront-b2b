import { AfterContentInit, ContentChild, Directive, ElementRef, Input, NgZone, OnDestroy } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CollapseContentDirective } from './collapse-content.directive';

@Directive({
    selector: '[appCollapseItem]',
    exportAs: 'appCollapseItem',
})
export class CollapseItemDirective implements OnDestroy, AfterContentInit {
    @Input() public appCollapseItem: string = '';
    @Input('appCollapseItemIsOpen')
    public set isOpen(value: boolean) {
        this.toggle(value);
    }

    private destroy$: Subject<any> = new Subject();
    private contentInitialized = false;

    @ContentChild(CollapseContentDirective, { read: ElementRef }) content!: ElementRef;

    private get class(): string {
        return this.appCollapseItem;
    }

    private get element(): HTMLElement {
        return this.el.nativeElement;
    }

    public get isOpen(): boolean {
        return this.element.classList.contains(this.class);
    }

    constructor(
        private zone: NgZone,
        private el: ElementRef,
    ) { }

    public ngAfterContentInit(): void {
        // -->Track: clicks in order to collapse items
        this.zone.runOutsideAngular(() => {
            // -->Emit: on content element transition events
            fromEvent<TransitionEvent>(this.contentElement(), 'transitionend').pipe(
                takeUntil(this.destroy$),
            ).subscribe(event => {
                // -->Check: target and event name
                if (event.target === this.contentElement() && event.propertyName === 'height') {
                    // -->Clear: height style
                    this.contentElement().style.height = '';
                }
            });
        });

        // -->Mark: content as initialized
        this.contentInitialized = true;
    }

    /**
     * Toggle: collapsable item
     */
    public toggle(value?: boolean): void {
        // -->Set: value
        value = value !== undefined ? value : !this.isOpen;

        // -->Check: if action is needed
        if (value === this.isOpen) {
            return;
        }

        // -->Toggle: item according to value
        if (value) {
            this.open();
        } else {
            this.close();
        }
    }

    /**
     * Open: collapsable item
     */
    private open(): void {
        // -->Set: content
        const content = this.contentElement();

        // -->Check: content and if initialized
        if (content && this.contentInitialized) {
            // -->Get: initial height
            const startHeight = content.getBoundingClientRect().height;
            // -->Add: class to mark element as open
            this.element.classList.add(this.class);
            // -->Get: updated height
            const endHeight = content.getBoundingClientRect().height;

            // -->Set: height style
            content.style.height = `${startHeight}px`;
            // -->Force: reflow
            this.element.getBoundingClientRect();
            // -->Update: height style
            content.style.height = `${endHeight}px`;
        } else {
            // -->Add: class to mark element as open
            this.element.classList.add(this.class);
        }
    }

    /**
     * Close: collapsable item
     */
    private close(): void {
        // -->Set: content
        const content = this.contentElement();

        // -->Check: content and if initialized
        if (content && this.contentInitialized) {
            // -->Get: start height
            const startHeight = content.getBoundingClientRect().height;
            // -->Set: height style
            content.style.height = `${startHeight}px`;
            // -->Remove: class so element is not marked as open
            this.element.classList.remove(this.class);

            // -->Force: reflow
            this.element.getBoundingClientRect();
            // -->Clear: height style
            content.style.height = '';
        } else {
            // -->Remove: class so element is not marked as open
            this.element.classList.remove(this.class);
        }
    }

    /**
     * Get: content element
     */
    private contentElement(): HTMLElement {
        return this.content ? this.content.nativeElement : this.element;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
