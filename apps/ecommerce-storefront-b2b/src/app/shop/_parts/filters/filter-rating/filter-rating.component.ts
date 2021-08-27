import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { RatingFilter, RatingFilterItem } from '../../../../interfaces/filter';

@Component({
    selector: 'app-filter-rating',
    templateUrl: './filter-rating.component.html',
    styleUrls: ['./filter-rating.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FilterRatingComponent),
            multi: true,
        },
    ],
})
export class FilterRatingComponent implements OnInit, OnDestroy, ControlValueAccessor {
    @Input() public options!: RatingFilter;

    private destroy$: Subject<void> = new Subject<void>();
    private value: any[] = [];
    private changeFn: (_: number) => void = () => {};
    private touchedFn: () => void = () => {};

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
     * Track: by item rating
     */
    public trackByRating(index: number, item: RatingFilterItem): number {
        return item.rating;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
