import { Component, Input } from '@angular/core';
import { UrlService } from '../../../../services/url.service';
import { CategoryFilter } from '../../../../interfaces/filter';

@Component({
    selector: 'app-filter-category',
    templateUrl: './filter-category.component.html',
    styleUrls: ['./filter-category.component.scss'],
})
export class FilterCategoryComponent {
    @Input() public options!: CategoryFilter;

    constructor(
        public url: UrlService,
    ) { }
}
