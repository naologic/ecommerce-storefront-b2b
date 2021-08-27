import { Pipe, PipeTransform } from '@angular/core';
import { Product, Variant } from '../../interfaces/product';

@Pipe({
    name: 'getProductImage',
})
export class GetProductImagePipe implements PipeTransform {
    public transform(product: Product, variant: Variant): string {
        // -->Fallback: image
        const fallback = 'assets/images/image-not-available.png';
        // -->Check: If the variant has any images
        if (variant?.images?.length) {
            return variant.images[0] || fallback;
        }
        // -->Check: if the product has any images as fallback
        return product?.data?.images?.length ? (product?.data?.images[0] || fallback) : fallback;
    }
}
