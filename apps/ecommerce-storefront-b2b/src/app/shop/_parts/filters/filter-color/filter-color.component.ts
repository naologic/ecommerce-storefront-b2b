import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ColorFilter, ColorFilterItem } from '../../../../interfaces/filter';
import { ColorType, colorType } from '../../../../shared/functions/color';

@Component({
    selector: 'app-filter-color',
    templateUrl: './filter-color.component.html',
    styleUrls: ['./filter-color.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FilterColorComponent),
            multi: true,
        },
    ],
})
export class FilterColorComponent implements ControlValueAccessor {
    @Input() public options!: ColorFilter;

    private value: string[] = [];
    private changeFn: (_: string[]) => void = () => {};
    private touchedFn: () => void = () => {};

    constructor() { }

    /**
     * Register: callback function to handle value changes
     */
    public registerOnChange(fn: any): void {
        this.changeFn = fn;
    }

    /**
     * Register: callback function to handle control touch events
     */
    public registerOnTouched(fn: any): void {
        this.touchedFn = fn;
    }

    /**
     * Set: value
     */
    public writeValue(value: string[]): void {
        this.value = value;
    }

    /**
     * Set: color type
     */
    public colorType(color: string): ColorType {
        return colorType(color);
    }

    /**
     * Handle: item changes
     */
    public onItemChange(item: ColorFilterItem, event: Event): void {
        // -->Get: element checked value
        const checked = (event.target as HTMLInputElement).checked;

        if (checked && !this.isItemChecked(item)) {
            // -->Add: item slug to value array
            this.value = [...this.value, item.slug];
            // -->Handle: changes
            this.changeFn(this.value);
        }
        if (!checked && this.isItemChecked(item)) {
            // -->Remove: item slug from value array
            this.value = this.value.filter(x => x !== item.slug);
            // -->Handle: changes
            this.changeFn(this.value);
        }
    }

    /**
     * Check: if item is checked
     */
    public isItemChecked(item: ColorFilterItem): boolean {
        return this.value.includes(item.slug);
    }

    /**
     * Track: item by slug
     */
    public trackBySlug(index: number, item: ColorFilterItem): string {
        return item.slug;
    }
}
