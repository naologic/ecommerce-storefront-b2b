import { FilterHandler } from './filter.handler';
import { FilterCheckHandler } from './filter-check/filter-check.handler';
import { FilterColorHandler } from './filter-color/filter-color.handler';
import { FilterRadioHandler } from './filter-radio/filter-radio.handler';
import { FilterRangeHandler } from './filter-range/filter-range.handler';
import { FilterRatingHandler } from './filter-rating/filter-rating.handler';


export const filterHandlers: FilterHandler[] = [
    new FilterCheckHandler(),
    new FilterColorHandler(),
    new FilterRadioHandler(),
    new FilterRangeHandler(),
    new FilterRatingHandler(),
];
