import { Directive, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { fromEvent } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';

/**
 * This directive adds the "owl-prevent-click" class to the .owl-carousel element when dragging.
 * When the class "owl-prevent-click" is applied to an element, a pseudo-element is created and
 * a mouseup event occurs on it, which prevents clicking.
 */
@Directive({
    selector: '[appOwlPreventClick]',
})
export class OwlPreventClickDirective implements OnInit {
    private get element(): HTMLElement {
        return this.elementRef.nativeElement;
    }

    constructor(
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: any,
        private elementRef: ElementRef,
        private zone: NgZone,
    ) { }

    public ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.zone.runOutsideAngular(() => {
                const children: Element[] = [].slice.call(this.element.children);
                const owlCarouselElement = children.find(element => element.classList.contains('owl-carousel'));

                // -->Check: owlCarouselElement
                if (!owlCarouselElement) {
                    return;
                }

                // -->Track: mouse down event on carousel element
                fromEvent<MouseEvent>(owlCarouselElement, 'mousedown').subscribe(mouseDownEvent => {
                    // -->Set: timeout
                    const timeout = setTimeout(() => {
                        // -->Prevent: clicking
                        owlCarouselElement.classList.add('owl-prevent-click');
                    }, 250);
                    // -->Set: mouseUpEvent (used as completion condition)
                    const mouseUpEvent$ = fromEvent<MouseEvent>(this.document, 'mouseup').pipe(take(1));

                    // -->Track: mouse move event on the document until mouse up
                    fromEvent<MouseEvent>(this.document, 'mousemove').pipe(
                        takeUntil(mouseUpEvent$),
                        map(mouseMoveEvent => Math.abs(Math.sqrt(
                            Math.pow(mouseDownEvent.clientX - mouseMoveEvent.clientX, 2) +
                            Math.pow(mouseDownEvent.clientY - mouseMoveEvent.clientY, 2),
                        ))),
                        filter(distance => distance > 15),
                        take(1),
                    ).subscribe(() => {
                        // -->Prevent: clicking
                        owlCarouselElement.classList.add('owl-prevent-click');
                    });

                    mouseUpEvent$.subscribe(() => {
                        // -->Allow: clicking
                        owlCarouselElement.classList.remove('owl-prevent-click');
                        // -->Clear: timeout
                        clearTimeout(timeout);
                    });
                });
            });
        }
    }
}
