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
import {isPlatformBrowser} from '@angular/common';
import {OwlCarouselOConfig} from 'ngx-owl-carousel-o/lib/carousel/owl-carousel-o-config';
import {CarouselComponent, SlidesOutputData} from 'ngx-owl-carousel-o';
import {Subject, timer} from 'rxjs';
import {switchMap, takeUntil} from 'rxjs/operators';
import {LanguageService} from '../language/services/language.service';
import {Image} from "../../interfaces/product";

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
  @Input()
  public set images(images: Image[]) {
    this.items = images
      .filter(image => !!image)
      .map((image, index) => {
        return { id: `image-${index}`, image: image.cdnLink } as ProductGalleryItem;
      });
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
  public currentItem: ProductGalleryItem | null = null;
  public showGallery = true;
  public carouselOptions!: Partial<OwlCarouselOConfig>;
  public thumbnailsCarouselOptions!: Partial<OwlCarouselOConfig>;

  @ViewChild('featuredCarousel', {read: CarouselComponent}) featuredCarousel!: CarouselComponent;
  @ViewChild('thumbnailsCarousel', {read: CarouselComponent}) thumbnailsCarousel!: CarouselComponent;
  @ViewChildren('imageElement', {read: ElementRef}) imageElements!: QueryList<ElementRef>;

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private language: LanguageService,
    private cd: ChangeDetectorRef,
  ) {
  }

  public ngOnInit(): void {
    // -->Init: options
    this.initOptions();

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
    }
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
        0: {items: 1},
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
        580: {items: 8, margin: 10},
        520: {items: 7, margin: 10},
        400: {items: 6, margin: 10},
        320: {items: 5, margin: 8},
        260: {items: 4, margin: 8},
        0: {items: 3},
      },
    };
  }

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
