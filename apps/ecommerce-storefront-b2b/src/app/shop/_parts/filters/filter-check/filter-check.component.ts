import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { BaseFilterItem, CheckFilter } from '../../../../interfaces/filter';

@Component({
    selector: 'app-filter-check',
    templateUrl: './filter-check.component.html',
    styleUrls: ['./filter-check.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FilterCheckComponent),
            multi: true,
        },
    ],
})
export class FilterCheckComponent implements OnInit, OnDestroy, ControlValueAccessor {
    @Input() public options!: CheckFilter;

    private destroy$: Subject<void> = new Subject<void>();
    private changeFn: (_: number) => void = () => {};
    private touchedFn: () => void = () => {};

    public value: any[] = [];
    public control: FormControl = new FormControl([]);

    constructor() { }

    public ngOnInit(): void {
        this.control.valueChanges.pipe(
            filter(value => value !== this.value),
            takeUntil(this.destroy$),
        ).subscribe(value => this.changeFn(value));
    }

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
     * Set: control value
     */
    public writeValue(obj: any): void {
        this.control.setValue(this.value = obj, { emitEvent: false });
    }

    /**
     * Track: item by _id
     */
    public trackBy(index: number, item: BaseFilterItem): string {
        return item._id;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
