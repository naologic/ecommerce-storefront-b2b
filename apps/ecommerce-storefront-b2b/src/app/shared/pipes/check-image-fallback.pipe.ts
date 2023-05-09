import { Pipe, PipeTransform } from '@angular/core';
import { Variant } from "../../interfaces/product";

@Pipe({
    name: 'checkImageFallback',
})
export class CheckImageFallbackPipe implements PipeTransform {
    public transform(value: string, selectedVariant?: Variant): string {
        // -->Fallback: image
        const fallback = 'assets/images/image-not-available.png';
        // -->Check: selected variant
        if (selectedVariant?.images?.length && selectedVariant?.images[0].cdnLink) {
            return selectedVariant.images[0]?.cdnLink;
        }
        // -->Check: image
        return (typeof value === 'string' && value) ? value : fallback
    }
}
