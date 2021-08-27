import { FormControl } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { shareReplay, takeUntil, map } from 'rxjs/operators';
import { NaoSettingsInterface } from '@naologic/nao-interfaces';
import { AppService } from '../../app.service';
import { CompareService } from '../../services/compare.service';
import { UrlService } from '../../services/url.service';
import { BaseAttribute, Variant, ProductVariant } from '../../interfaces/product';

interface Specification {
    name: string;
    sameValues: boolean;
    values: { [variantId: number]: BaseAttribute[] };
}

@Component({
    selector: 'app-page-compare',
    templateUrl: './page-compare.component.html',
    styleUrls: ['./page-compare.component.scss'],
})
export class PageCompareComponent implements OnInit, OnDestroy {
    private destroy$: Subject<void> = new Subject<void>();

    public appSettings: NaoSettingsInterface.Settings;
    public compareItems$: Observable<ProductVariant[]>;
    public specifications$: Observable<Specification[]>;
    public differentSpecifications$: Observable<Specification[]>;
    public show: FormControl = new FormControl('all');
    public clearInProgress = false;

    constructor(
        public compare: CompareService,
        public url: UrlService,
        private appService: AppService,
        private translate: TranslateService
    ) {
        this.compareItems$ = this.compare.items$.pipe(shareReplay(1));

        // -->Build: variants specifications grouped by name
        this.specifications$ = this.compareItems$.pipe(
            map((compareItems) => {
                const specifications: Specification[] = [];

                // -->Group: specifications from all variants
                compareItems.forEach(({ variant }) => {
                    // -->Get: variant specifications
                    const variantSpecifications = this.getVariantSpecifications(
                        variant
                    );

                    variantSpecifications.forEach((variantSpecification) => {
                        // -->Find: specification by name
                        let specification = specifications.find(x => x.name === variantSpecification.name);

                        // -->Add: specification if not found
                        if (!specification) {
                            // -->Set: initial values for the specification
                            specification = {
                                name: variantSpecification.name,
                                sameValues: false,
                                values: {},
                            };

                            // -->Add: specification
                            specifications.push(specification);
                        }

                        // -->Update: specification value for a specific variant
                        specification.values[variant.id] = variantSpecification;
                    });
                });

                // -->Check: if the values of all variants are the same for each specification
                specifications.forEach((specification) => {
                    // -->Get: all values for a specific specification
                    const values = compareItems.map(({ variant }) => {
                        return specification.values[variant.id];
                    });

                    // -->Check: values
                    if (values && values.length > 0) {
                        // -->Get: first value
                        const firstValue = values[0]?.value;
                        // -->Compare: the rest of the values with the first one
                        specification.sameValues = values.every((v) => v?.value == firstValue);
                    }
                });

                return specifications;
            }),
            shareReplay(1)
        );

        // -->Filter: specifications for variants with the same values
        this.differentSpecifications$ = this.specifications$.pipe(
            map((specifications) => specifications.filter(x => !x.sameValues)),
            shareReplay(1)
        );
    }

    public ngOnInit(): void {
        // -->Set: app settings
        this.appSettings = this.appService.settings.getValue();
    }

    /**
     * Get: variant specifications
     */
    private getVariantSpecifications(variant: Variant): BaseAttribute[] {
        // -->Check: variant
        if (!variant) {
            return;
        }

        const variantSpecifications: BaseAttribute[] = [];

        // -->Check: height
        if (variant.height) {
            variantSpecifications.push({
                name: this.translate.instant('VARIANT_SPECIFICATION_HEIGHT'),
                value: `${variant.height} ${variant.dimensionUOM}`
            });
        }
        // -->Check: width
        if (variant.width) {
            variantSpecifications.push({
                name: this.translate.instant('VARIANT_SPECIFICATION_WIDTH'),
                value: `${variant.width} ${variant.dimensionUOM}`
            });
        }
        // -->Check: depth
        if (variant.depth) {
            variantSpecifications.push({
                name: this.translate.instant('VARIANT_SPECIFICATION_DEPTH'),
                value: `${variant.depth} ${variant.dimensionUOM}`
            });
        }
        // -->Check: weight
        if (variant.weight) {
            variantSpecifications.push({
                name: this.translate.instant('VARIANT_SPECIFICATION_WEIGHT'),
                value: `${variant.weight} ${variant.weightUOM}`
            });
        }
        // -->Check: volume
        if (variant.volume) {
            variantSpecifications.push({
                name: this.translate.instant('VARIANT_SPECIFICATION_VOLUME'),
                value: `${variant.volume} ${variant.volumeUOM}`
            });
        }

        return variantSpecifications;
    }

    /**
     * Clear: compare view by removing all variants
     */
    public clear(): void {
        // -->Check: if a clear is already in progress
        if (this.clearInProgress) {
            return;
        }

        // -->Start: loading
        this.clearInProgress = true;

        // -->Clear: compare
        this.compare.clear().pipe(takeUntil(this.destroy$)).subscribe({
            complete: () => {
                // -->Done: loading
                this.clearInProgress = false;
            },
        });
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
