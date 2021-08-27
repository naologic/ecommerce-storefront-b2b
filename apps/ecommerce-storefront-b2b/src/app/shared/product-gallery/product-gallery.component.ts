import {
    ChangeDetectorRef,
    Component,
    ElementRef,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    QueryList,
    ViewChild,
    ViewChildren,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { OwlCarouselOConfig } from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';
import { CarouselComponent, SlidesOutputData } from 'ngx-owl-carousel-o';
import { Subject, timer } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { LanguageService } from '../language/services/language.service';
import {
    PhotoSwipeItem,
    PhotoSwipeOptions,
    PhotoSwipeService,
    PhotoSwipeThumbBounds,
} from '../../services/photo-swipe.service';

export type ProductGalleryLayout = 'product-sidebar' | 'product-full' | 'quickview';

export interface ProductGalleryItem {
    id: string;
    image: string;
}

@Component({
    selector: 'app-product-gallery',
    templateUrl: './product-gallery.component.html',
    styleUrls: ['./product-gallery.component.scss'],
})
export class ProductGalleryComponent implements OnInit, OnDestroy {
    @Input() public set images(images: string[]) {
        this.items = images.map((image, index) => ({ id: `image-${index}`, image }));
        // -->Check: length
        if (!this.items.length) {
            // -->Set: fallback image
            this.items[0] = this.fallbackImage
        }
        this.currentItem = this.items[0];
    }
    @Input() public layout!: ProductGalleryLayout;

    private destroy$: Subject<void> = new Subject<void>();
    private fallbackImage: ProductGalleryItem = {
        id: 'fallback',
        image: 'assets/images/image-not-available.png'
    }

    public items: ProductGalleryItem[] = [];
    public currentItem: ProductGalleryItem|null = null;
    public showGallery = true;
    public carouselOptions!: Partial<OwlCarouselOConfig>;
    public thumbnailsCarouselOptions!: Partial<OwlCarouselOConfig>;

    @ViewChild('featuredCarousel', { read: CarouselComponent }) featuredCarousel!: CarouselComponent;
    @ViewChild('thumbnailsCarousel', { read: CarouselComponent }) thumbnailsCarousel!: CarouselComponent;
    @ViewChildren('imageElement', { read: ElementRef }) imageElements!: QueryList<ElementRef>;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private language: LanguageService,
        private photoSwipe: PhotoSwipeService,
        private cd: ChangeDetectorRef,
    ) { }

    public ngOnInit(): void {
        // -->Init: options
        this.initOptions();

        if (this.layout !== 'quickview' && isPlatformBrowser(this.platformId)) {
            // -->Load: photo swipe library
            this.photoSwipe.load().subscribe();
        }

        // Since ngx-owl-carousel-o cannot re-initialize itself, we will do it manually when the direction changes.
        this.language.directionChange$.pipe(
            switchMap(() => timer(250)),
            takeUntil(this.destroy$),
        ).subscribe(() => {
            // -->Init: carousel options
            this.initOptions();
            // -->Set: current item
            this.currentItem = this.items[0] || this.fallbackImage;

            // -->Hide: gallery temporarily
            this.showGallery = false;
            // -->Mark: as changed
            this.cd.detectChanges();
            // -->Show: gallery again
            this.showGallery = true;
        });
    }

    /**
     * Update: images showing on the carousel
     */
    public featuredCarouselTranslated(event: SlidesOutputData): void {
        // -->Check: slides length
        if (event.slides?.length) {
            // -->Set: active image id
            const activeImageId = event.slides[0].id;

            // -->Get: and set current gallery item by id. Use fallback item if not found
            this.currentItem = this.items.find(x => x.id === activeImageId) || this.items[0] || this.fallbackImage;

            // -->Rewind: carousel to slide with active image id
            if (!this.thumbnailsCarousel.slidesData.find(slide => slide.id === activeImageId && slide.isActive)) {
                this.thumbnailsCarousel.to(activeImageId);
            }
        }
    }

    /**
     * Handle: feature image click events
     */
    public onFeaturedImageClick(event: MouseEvent, image: any): void {
        // -->Check: layout type
        if (this.layout !== 'quickview') {
            event.preventDefault();

            // -->Open: photo swipe gallery
            this.openPhotoSwipe(image);
        }
    }

    /**
     * Open: photo swipe gallery
     */
    public openPhotoSwipe(item: ProductGalleryItem|null): void {
        // -->Check: item
        if (!item) {
            return;
        }

        const imageElements = this.imageElements.map(x => x.nativeElement);
        // -->Get: images info from photo gallery items
        const images: PhotoSwipeItem[] = this.items.map((eachItem, i) => {
            const tag: HTMLImageElement = imageElements[i];
            const width = (tag.dataset.width && parseFloat(tag.dataset.width)) || tag.naturalWidth;
            const height = (tag.dataset.height && parseFloat(tag.dataset.height)) || tag.naturalHeight;

            // -->Return: image info
            return {
                src: eachItem.image,
                msrc: eachItem.image,
                w: width,
                h: height,
            };
        });

        // -->Check: if images need to be played on reverse
        if (this.language.isRTL()) {
            images.reverse();
        }

        // noinspection JSUnusedGlobalSymbols
        // -->Build: photo swipe options
        const options = {
            getThumbBoundsFn: ((index: number) => this.getThumbBounds(index)) as PhotoSwipeOptions['getThumbBoundsFn'],
            index: this.getDirDependentIndex(this.items.indexOf(item)),
            bgOpacity: .9,
            history: false,
        };

        // -->Open: photo swipe gallery
        this.photoSwipe.open(images, options).subscribe(galleryRef => {
            galleryRef.listen('beforeChange', () => {
                // -->Transition: between slides according to current item id
                this.featuredCarousel.to(this.items[this.getDirDependentIndex(galleryRef.getCurrentIndex())].id);
            });
        });
    }

    /**
     * Handle: thumbnails item click events
     */
    public onThumbnailImageClick(item: ProductGalleryItem): void {
        // -->Transition: to item slide
        this.featuredCarousel.to(item.id);
        // -->Set: current item
        this.currentItem = item;
    }

    /**
     * Init: carousel and thumbnailsCarousel options
     */
    private initOptions(): void {
        // -->Init: carouselOptions
        this.carouselOptions = {
            dots: false,
            autoplay: false,
            rtl: this.language.isRTL(),
            responsive: {
                0: { items: 1 },
            },
        };

        // -->Init: thumbnailsCarouselOptions
        this.thumbnailsCarouselOptions = {
            dots: false,
            autoplay: false,
            margin: 10,
            items: 5,
            rtl: this.language.isRTL(),
            responsive: {
                580: { items: 8, margin: 10 },
                520: { items: 7, margin: 10 },
                400: { items: 6, margin: 10 },
                320: { items: 5, margin: 8 },
                260: { items: 4, margin: 8 },
                0: { items: 3 },
            },
        };
    }

    /**
     * Get: direction dependent index
     */
    private getDirDependentIndex(index: number): number {
        // -->Check language direction
        if (this.language.isRTL()) {
            // Invert: index id because photoswipe do not support rtl
            return this.items.length - 1 - index;
        }

        return index;
    }

    /**
     * Get: Thumbnail bounds
     */
    private getThumbBounds(index: number): PhotoSwipeThumbBounds|null {
        // -->Set: elements
        const imageElements = this.imageElements.toArray();
        // -->Set: direction dependent index
        const dirDependentIndex = this.getDirDependentIndex(index);

        // -->Check: image in the specified index exist
        if (!imageElements[dirDependentIndex]) {
            return null;
        }

        // -->Compute: position and size related values
        const tag = imageElements[dirDependentIndex].nativeElement;
        const width = tag.naturalWidth;
        const height = tag.naturalHeight;
        const rect = tag.getBoundingClientRect();
        const ration = Math.min(rect.width / width, rect.height / height);
        const fitWidth = width * ration;
        const fitHeight = height * ration;

        return {
            x: rect.left + (rect.width - fitWidth) / 2 + window.pageXOffset,
            y: rect.top + (rect.height - fitHeight) / 2 + window.pageYOffset,
            w: fitWidth,
        };
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
