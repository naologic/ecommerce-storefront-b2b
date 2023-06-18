import { Inject, Injectable, NgZone, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, Subscriber, from } from 'rxjs';
import { ResourcesService } from './resources.service';

declare const PhotoSwipe: any;
declare const PhotoSwipeUI_Default: any;

export interface PhotoSwipeModelRef {
    close: () => void;
    listen: (eventName: string, callbackFn: (...args: any) => void) => void;
    getCurrentIndex: () => number;
}

export interface PhotoSwipeItem {
    src: string;
    w: number;
    h: number;
    msrc?: string;
    title?: string;
}

export interface PhotoSwipeThumbBounds {
    x: number;
    y: number;
    w: number;
}

export interface PhotoSwipeOptions {
    index?: number;
    getThumbBoundsFn?: (index: number) => PhotoSwipeThumbBounds;
    showHideOpacity?: boolean;
    bgOpacity?: number;
    loop?: boolean;
    history?: boolean;
}

const template = `
<div class="pswp" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="pswp__bg"></div>
    <div class="pswp__scroll-wrap">
        <div class="pswp__container">
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
            <div class="pswp__item"></div>
        </div>
        <div class="pswp__ui pswp__ui--hidden">
            <div class="pswp__top-bar">
                <div class="pswp__counter"></div>
                <button class="pswp__button pswp__button--close" title="Close (Esc)"></button>
                <!--<button class="pswp__button pswp__button&#45;&#45;share" title="Share"></button>-->
                <button class="pswp__button pswp__button--fs" title="Toggle fullscreen"></button>
                <button class="pswp__button pswp__button--zoom" title="Zoom in/out"></button>
                <div class="pswp__preloader">
                    <div class="pswp__preloader__icn">
                      <div class="pswp__preloader__cut">
                        <div class="pswp__preloader__donut"></div>
                      </div>
                    </div>
                </div>
            </div>
            <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                <div class="pswp__share-tooltip"></div>
            </div>
            <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)"></button>
            <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)"></button>
            <div class="pswp__caption">
                <div class="pswp__caption__center"></div>
            </div>
        </div>
    </div>
</div>
`;

@Injectable({
    providedIn: 'root',
})
export class PhotoSwipeService implements OnDestroy {
    private initialized = false;
    private element!: HTMLDivElement;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private zone: NgZone,
        private resources: ResourcesService,
    ) { }

    /**
     * Load: photo swipe library
     */
    public load(): Observable<void> {
        return from(this.loadLibrary());
    }

    /**
     * Open: photo swipe gallery
     */
    public open(items: PhotoSwipeItem[], options: PhotoSwipeOptions): Observable<PhotoSwipeModelRef> {
        return new Observable(observer => {
            this.zone.runOutsideAngular(() => {
                // -->Load: library
                this.loadLibrary().then(() => {
                    // -->Check: if unsubscribed
                    if (observer.closed) {
                        return;
                    }
                    // -->Check: if initialization is needed
                    if (!this.initialized) {
                        this.init();
                    }

                    // -->Create: photo swipe gallery
                    this.createGallery(observer, items, options);
                });
            });
        });
    }

    /**
     * Create: photo swipe gallery
     */
    private createGallery(observer: Subscriber<PhotoSwipeModelRef>, items: PhotoSwipeItem[], options: PhotoSwipeOptions): void {
        let gallery: (typeof PhotoSwipe)|null = null;

        // -->Set: photo swipe gallery
        gallery = new PhotoSwipe(this.element, PhotoSwipeUI_Default, items, options);
        // -->Show: gallery until destroyed
        gallery.listen('destroy', () => this.zone.run(() => {
            gallery = null;
            this.zone.run(() => observer.complete());
        }));
        // -->Init: gallery
        gallery.init();

        // -->Build: photo swipe model
        const modelRef: PhotoSwipeModelRef = {
            close: () => gallery.close(),
            listen: (eventName, callbackFn) => gallery.listen(eventName, (...args: any[]) => {
                this.zone.run(() => callbackFn(...args));
            }),
            getCurrentIndex: () => gallery.getCurrentIndex(),
        };

        // -->Destroy: gallery on unsubscribe
        observer.add(() => {
            if (gallery) {
                gallery.destroy();
            }
        });

        // -->Emit: photo swipe model
        this.zone.run(() => observer.next(modelRef));
    }

    /**
     * Load: photo swipe from resources
     */
    private loadLibrary(): Promise<void> {
        return this.resources.loadLibrary('photoSwipe');
    }

    /**
     * Append: gallery element to document
     */
    private init(): void {
        this.initialized = true;

        // -->Create: gallery div element
        const galleryElement = this.document.createElement('div');
        // -->Set: inner html template
        galleryElement.innerHTML = template;

        // -->Set: element
        this.element = galleryElement.firstElementChild as HTMLDivElement;

        // -->Append: element to document
        this.document.body.appendChild(this.element);
    }

    public ngOnDestroy(): void {
        if (this.initialized) {
            this.element.parentElement?.removeChild(this.element);
        }
    }
}
