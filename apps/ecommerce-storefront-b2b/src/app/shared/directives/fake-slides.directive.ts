import { Directive, ElementRef, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { EventManager } from '@angular/platform-browser';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';

@Directive({
    selector: '[appFakeSlides]',
    exportAs: 'appFakeSlides',
})
export class FakeSlidesDirective implements OnInit, OnChanges, OnDestroy {
    @Input() public options: Partial<OwlCarouselOConfig> = {};
    @Input() public appFakeSlides = 0;

    private resizeHandler = () => {};

    public slides: number[] = [];
    public slidesCount = 0;

    constructor(
        private eventManager: EventManager,
        private el: ElementRef,
    ) { }

    public ngOnInit(): void {
        this.resizeHandler = this.eventManager.addGlobalEventListener('window', 'resize', () => this.calc()) as () => void;
        this.calc();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.calc();
    }

    /**
     * Compute: slides count
     */
    private calc(): void {
        let newFakeSlidesCount = 0;

        // -->Check: options
        if (this.options) {
            let match = -1;
            const viewport = this.el.nativeElement.querySelector('.owl-carousel').clientWidth;
            const overwrites = this.options.responsive as {[breakpoint: number]: any};

            // -->Check: overwrites
            if (overwrites) {
                for (const key in overwrites) {
                    if (overwrites.hasOwnProperty(key)) {
                        if (+key <= viewport && +key > match) {
                            // -->Update: match
                            match = Number(key);
                        }
                    }
                }
            }

            // -->Update: newFakeSlidesCount according to match (if found) or option items number
            if (match >= 0) {
                const items = overwrites[match].items;
                newFakeSlidesCount = Math.max(0, items - this.appFakeSlides);
            } else if (this.options.items) {
                newFakeSlidesCount = Math.max(0, this.options.items - this.appFakeSlides);
            }
        }

        // -->Check: if slides need to be updated
        if (this.slidesCount !== newFakeSlidesCount) {
            this.slides = [];
            this.slidesCount = newFakeSlidesCount;

            for (let i = 0; i < newFakeSlidesCount; i++) {
                this.slides.push(i);
            }
        }
    }

    public ngOnDestroy(): void {
        if (this.resizeHandler) {
            this.resizeHandler();
        }
    }
}
