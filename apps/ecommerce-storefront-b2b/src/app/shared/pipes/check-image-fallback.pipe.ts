import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'checkImageFallback',
})
export class CheckImageFallbackPipe implements PipeTransform {
    public transform(value: string): string {
        // -->Fallback: image
        const fallback = 'assets/images/image-not-available.png';
        // -->Check: image
        return (typeof value === 'string' && value) ? value : fallback
    }
}
