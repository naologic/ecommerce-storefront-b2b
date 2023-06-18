import { Component, forwardRef, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { RadioFilter } from '../../../../interfaces/filter';

@Component({
    selector: 'app-filter-radio',
    templateUrl: './filter-radio.component.html',
    styleUrls: ['./filter-radio.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => FilterRadioComponent),
            multi: true,
        },
    ],
})
export class FilterRadioComponent implements OnInit, OnDestroy, ControlValueAccessor {
    @Input() public options!: RadioFilter;

    private destroy$: Subject<void> = new Subject<void>();
    private value: any;
    private changeFn: (_: number) => void = () => {};
    private touchedFn: () => void = () => {};

    public control: FormControl = new FormControl();

    constructor() { }

    public ngOnInit(): void {
        this.control.valueChanges.pipe(
            filter(value => value !== this.value),
            takeUntil(this.destroy$),
        ).subscribe(value => {
            this.value = value;
            this.changeFn(value);
        });
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

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
