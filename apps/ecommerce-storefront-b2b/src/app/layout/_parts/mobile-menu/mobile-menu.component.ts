import {
    AfterViewChecked,
    AfterViewInit,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    ElementRef,
    Inject,
    NgZone,
    OnDestroy,
    OnInit,
    PLATFORM_ID,
    TemplateRef,
    ViewChild,
    ViewContainerRef,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LayoutMobileMenuService } from '../../layout-mobile-menu.service';
import { AppService } from "../../../app.service";
import { MobileMenuPanelComponent } from '../mobile-menu-panel/mobile-menu-panel.component';
import { nameToSlug } from "../../../shared/functions/utils";
import { MobileMenuLink } from '../../../interfaces/mobile-menu-link';

interface StackItem {
    content: TemplateRef<any>;
    componentRef: ComponentRef<MobileMenuPanelComponent>;
}

@Component({
    selector: 'app-mobile-menu',
    templateUrl: './mobile-menu.component.html',
    styleUrls: ['./mobile-menu.component.scss'],
})
export class MobileMenuComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
    private destroy$: Subject<void> = new Subject<void>();
    private subs = new Subscription();

    public links = [];
    public currentLevel = 0;
    public panelsStack: StackItem[] = [];
    public panelsBin: StackItem[] = [];
    public forceConveyorTransition = false;
    public infoSupport = null;

    @ViewChild('body') body!: ElementRef;
    @ViewChild('conveyor') conveyor!: ElementRef;
    @ViewChild('panelsContainer', { read: ViewContainerRef }) panelsContainer!: ViewContainerRef;

    constructor(
        @Inject(PLATFORM_ID) private platformId: any,
        private cfr: ComponentFactoryResolver,
        private zone: NgZone,
        public menu: LayoutMobileMenuService,
        public appService: AppService,
    ) { }

    public ngOnInit(): void {
        // -->Subscribe: to info changes
        this.subs.add(
            this.appService.appInfo.subscribe(value => {
                // -->Set: info
                this.infoSupport = value?.support?.supportInfo;
                // -->Set: categories
                const categories = this.mapCategories(value?.categories?.items)

                // -->Set: mobile links
                this.links = [
                    {
                        title: 'Shop',
                        url: '/shop/category/products',
                    },
                    {
                        title: 'Categories',
                        url: '/shop/category/products',
                        submenu: categories
                    },
                    {
                        title: 'About Us',
                        url: '/site/about-us',
                    },
                    {
                        title: 'FAQ',
                        url: '/site/faq',
                    }
                ]
            })
        )

        // -->Set: menu
        this.menu.onOpenPanel.pipe(takeUntil(this.destroy$)).subscribe(({ content, label }) => {
            if (this.panelsStack.findIndex(x => x.content === content) !== -1) {
                return;
            }

            // -->Get: factory
            const componentFactory = this.cfr.resolveComponentFactory(MobileMenuPanelComponent);
            // -->Create: component
            const componentRef = this.panelsContainer.createComponent(componentFactory);

            componentRef.instance.label = label;
            componentRef.instance.content = content;
            componentRef.instance.level = this.panelsStack.length + 1;

            // -->Push: component to the panel
            this.panelsStack.push({ content, componentRef });
            // -->Update: current level
            this.currentLevel += 1;

            this.removeUnusedPanels();
        });

        // -->Clean: current panel on close
        this.menu.onCloseCurrentPanel.pipe(takeUntil(this.destroy$)).subscribe(() => {
            // -->Get: and remove last component from panel
            const panel = this.panelsStack.pop();

            // -->Check: panel
            if (!panel) {
                return;
            }

            // -->Mark: panel as unused
            this.panelsBin.push(panel);
            // -->Update: current level
            this.currentLevel -= 1;

            if (!isPlatformBrowser(this.platformId)) {
                // -->Destroy: unused panels
                this.removeUnusedPanels();
            }
        });
    }

    public ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            // -->Track: clicks in order to transition between panels or close menu
            this.zone.runOutsideAngular(() => {
                // -->Emit: on body element transition events
                fromEvent<TransitionEvent>(this.body.nativeElement, 'transitionend').pipe(
                    takeUntil(this.destroy$),
                ).subscribe((event) => {
                    // -->Check: target, event name and menu state
                    if (event.target === this.body.nativeElement && event.propertyName === 'transform' && !this.menu.isOpen) {
                        // -->Close: all panels
                        this.zone.run(() => this.onMenuClosed());
                    }
                });

                // -->Emit: on conveyor element transition events
                fromEvent<TransitionEvent>(this.conveyor.nativeElement, 'transitionend').pipe(
                    takeUntil(this.destroy$),
                ).subscribe((event) => {
                    // -->Check: target and event name
                    if (event.target === this.conveyor.nativeElement && event.propertyName === 'transform') {
                        // -->Remove: unused panels
                        this.zone.run(() => this.onConveyorStopped());
                    }
                });
            });
        }
    }

    public ngAfterViewChecked(): void {
        if (this.forceConveyorTransition) {
            this.forceConveyorTransition = false;

            if (isPlatformBrowser(this.platformId)) {
                // -->Set: element transition
                this.conveyor.nativeElement.style.transition = 'none';
                // -->Force: reflow
                this.conveyor.nativeElement.getBoundingClientRect();
                // -->Clean: element transition
                this.conveyor.nativeElement.style.transition = '';
            }
        }
    }

    /**
     * Clean: panels on menu close
     */
    private onMenuClosed(): void {
        let panel: StackItem|undefined;

        // -->Get: and remove all panels from stack
        while (panel = this.panelsStack.pop()) {
            // -->Add: panel to bin to be clean up later on
            this.panelsBin.push(panel);
            // -->Update: current level
            this.currentLevel -= 1;
        }

        // -->Remove: unused panels
        this.removeUnusedPanels();
        this.forceConveyorTransition = true;
    }

    /**
     * Clean: panels on conveyor stop
     */
    private onConveyorStopped(): void {
        this.removeUnusedPanels();
    }

    /**
     * Remove: unused panels
     */
    private removeUnusedPanels(): void {
        let panel: StackItem|undefined;

        // -->Get: and remove panel from bin
        while (panel = this.panelsBin.pop()) {
            // -->Destroy: component
            panel.componentRef.destroy();
        }
    }

    /**
     * Handle: link click.
     * Close menu if item has no submenu
     */
    public onLinkClick(item: MobileMenuLink): void {
        if (!item.submenu || item.submenu.length < 1) {
            this.menu.close();
        }
    }

    /**
     * Map: categories for mobile menu
     */
    public mapCategories(categories: any[]): MobileMenuLink[] {
        // -->Check: categories
        if (!Array.isArray(categories)) {
            categories = [];
        }

        // -->Init: items
        const items: MobileMenuLink[] = [];

        // -->Get: route level categories
        const rootLevelCategories = categories.filter(c => (c.parentId === 0 || c.parentId === '0') && c.level === 0);
        // -->Iterate: over categories and set the root level ones
        rootLevelCategories.forEach(category => {
            // -->Create: category
            const item: MobileMenuLink = {
                title: category.name,
                url: `/shop/category/${nameToSlug(category.name)}/${category.id}/products`
            }

            // -->Get: all second level categories for this parent
            const subCategories = categories.filter(c => c.parentId === category.id && c.level === 1);
            if (subCategories.length) {
                // -->Init: submenu
                item.submenu = [];

                // -->Iterate: over subcategories and check if there are any other links inside
                subCategories.forEach(subCategory => {
                    // -->Get: links for sub category
                    const links = categories.filter(c => c.parentId === subCategory.id && c.level === 2);
                    // -->Create: sub category
                    const subCategory$: MobileMenuLink = {
                        title: subCategory.name,
                        url: `/shop/category/${nameToSlug(subCategory.name)}/${subCategory.id}/products`
                    }

                    // -->Check: links
                    if (links.length) {
                        subCategory$.submenu = links.map(link => {
                            return {
                                title: link.name,
                                url: `/shop/category/${nameToSlug(link.name)}/${link.id}/products`
                            }
                        })
                    }

                    // -->Push: subcategory (column)
                    item.submenu.push(subCategory$);
                })
            }

            // -->Push: category
            items.push(item)
        });

        return items;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
