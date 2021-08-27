import { Observable } from 'rxjs';

/**
 * Track: media query changes
 */
export function fromMatchMedia(query: string, skipFirst = true): Observable<MediaQueryList> {
    return new Observable(observer => {
        // -->Get: media list from query
        const mediaQueryList = matchMedia(query);

        // -->Emit: media query list on onChange calls
        const onChange = () => observer.next(mediaQueryList);

        // -->Check: if onChange call should be skipped the first time
        if (!skipFirst) {
            onChange();
        }

        // -->Check: function
        if (mediaQueryList.addEventListener) {
            // -->Add: change event listener
            mediaQueryList.addEventListener('change', onChange);

            // -->Remove: event listener on unsubscribe calls
            return () => mediaQueryList.removeEventListener('change', onChange);
        } else {
            // -->Add: listener
            // noinspection JSDeprecatedSymbols
            mediaQueryList.addListener(onChange);

            // -->Remove: listener on unsubscribe calls
            // noinspection JSDeprecatedSymbols
            return () => mediaQueryList.removeListener(onChange);
        }
    });
}
