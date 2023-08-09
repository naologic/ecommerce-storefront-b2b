import { Directive, Input, ElementRef, HostListener } from '@angular/core';


/**
 * Directive to display a fallback image if the image is not available.
 */
@Directive({
  selector: 'img[naoFallbackImage]'
})
export class NaoFallbackImageDirective {
  /**
   * Fallback image
   */
  @Input() public fallbackImage: string = 'assets/images/category-placeholder.png';
  /**
   * Fallback width
   */
  @Input() public fallbackWidth!: number;

  constructor(private eRef: ElementRef) { }

  @HostListener('error')
  public loadFallbackOnError(): void {
    const element: HTMLImageElement = <HTMLImageElement>this.eRef.nativeElement;
    // -->Set: src
    element.src = this.fallbackImage || 'assets/images/category-placeholder.png';

    if (this.fallbackWidth) {
      element.width = this.fallbackWidth;
    }
  }
}
