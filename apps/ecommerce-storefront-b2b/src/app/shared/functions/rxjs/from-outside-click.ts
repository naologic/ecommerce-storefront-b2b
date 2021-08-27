import { fromEvent, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Track: outside element clicks
 */
export function fromOutsideClick(element: HTMLElement | HTMLElement[]): Observable<MouseEvent> {
    const elements = Array.isArray(element) ? element : [element];

    return fromEvent<MouseEvent>(document, 'click').pipe(
        filter(event => {
            const target = event.target as Node;

            return elements.reduce<boolean>((acc, e) => acc && e !== target && !e.contains(target), true);
        }),
    );
}
