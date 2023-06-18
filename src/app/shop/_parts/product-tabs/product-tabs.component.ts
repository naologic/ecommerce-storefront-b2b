import { AfterContentInit, Component, ContentChildren, Input, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageProductLayout } from '../../page-product/page-product.component';
import { ProductTabComponent } from '../product-tab/product-tab.component';

@Component({
    selector: 'app-product-tabs',
    templateUrl: './product-tabs.component.html',
    styleUrls: ['./product-tabs.component.scss'],
})
export class ProductTabsComponent implements AfterContentInit {
    @Input() public layout: PageProductLayout = 'full';

    public activeTab!: ProductTabComponent;

    @ContentChildren(ProductTabComponent) public tabs!: QueryList<ProductTabComponent>;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    public ngAfterContentInit(): void {
        // -->Subscribe: to route fragment changes
        this.route.fragment.subscribe(fragment => {
            const activeTab = this.tabs.find(x => x.id === fragment) || this.tabs.first;

            // -->Set: active tab
            this.setActiveTab(activeTab);
        });
    }

    /**
     * Handle: tab click events
     */
    public onTabClick(event: MouseEvent, tab: ProductTabComponent): void {
        event.preventDefault();

        // -->Set: active tab
        this.setActiveTab(tab);
    }

    /**
     * Get: tab url
     */
    public getTabUrl(tab: ProductTabComponent): string {
        return this.router.createUrlTree([], { relativeTo: this.route, fragment: tab.id }).toString();
    }

    /**
     * Set: active tab
     */
    private setActiveTab(tab: ProductTabComponent): void {
        this.activeTab = tab;
        this.tabs.forEach(x => x.isActive = x === tab);
    }
}
