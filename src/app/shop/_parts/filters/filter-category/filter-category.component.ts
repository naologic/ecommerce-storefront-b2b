import { Component, Input } from '@angular/core';
import { UrlService } from '../../../../services/url.service';
import { CategoryFilter } from '../../../../interfaces/filter';
import { Router } from "@angular/router";
import { AppInterface } from "../../../../../app.interface";

@Component({
    selector: 'app-filter-category',
    templateUrl: './filter-category.component.html',
    styleUrls: ['./filter-category.component.scss'],
})
export class FilterCategoryComponent {
    @Input() public options!: CategoryFilter;

    constructor(
        public url: UrlService,
        private router: Router,
    ) {
    }

    /**
     * Redirect: to category and reset filters
     */
    public redirectCategory(category: AppInterface.Category): void {
        if (!category?.data?.name || !category?.docId) {
            return;
        }
        // -->Redirect: to the selected category
        this.router.navigateByUrl(this.url.category(category), { state: { resetFilters: true } }).then();
    }

    /**
     * Redirect: to all products
     */
    public redirectToAllProducts(): void {
        // -->Redirect: to shop
        this.router.navigateByUrl(this.url.allProducts(), { state: { resetFilters: true } }).then();
    }
}
