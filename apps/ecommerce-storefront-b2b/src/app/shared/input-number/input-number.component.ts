import { Component, ElementRef, forwardRef, Inject, Input, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DOCUMENT } from '@angular/common';

function parseNumber<T>(value: any, def: T): number | T {
    if (typeof value === 'string') {
        value = parseFloat(value);
    } else if (typeof value !== 'number') {
        value = def;
    }

    return isNaN(value) ? def : value;
}

@Component({
    selector: 'app-input-number',
    templateUrl: './input-number.component.html',
    styleUrls: ['./input-number.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => InputNumberComponent),
            multi: true,
        },
    ],
})
export class InputNumberComponent implements ControlValueAccessor {
    @Input() public size: 'sm'|'lg'|null = null;
    @Input() public set step(value: number) {
        this.options.step = parseNumber(value, 1);
    }
    @Input() public set min(value: number) {
        this.options.min = parseNumber(value, null);
    }
    @Input() public set max(value: number) {
        this.options.max = parseNumber(value, null);
    }
    @Input() public set disabled(value: boolean) {
        this.options.disabled = !!value;
    }
    @Input() public set readonly(value: boolean) {
        this.options.readonly = !!value;
    }

    private onChange = (_: any) => {};

    public onTouched = () => {};
    public options = {
        step: 1,
        min: null as null|number,
        max: null as null|number,
        disabled: false,
        readonly: false,
    };

    @ViewChild('inputElement', { static: true }) inputElementRef!: ElementRef;

    public get inputElement(): HTMLInputElement {
        return this.inputElementRef.nativeElement;
    }

    public get value(): '' | number {
        return this.inputElement.value === '' ? '' : parseFloat(this.inputElement.value);
    }
    public set value(value: '' | number) {
        this.writeValue(value);
    }

    constructor(
        @Inject(DOCUMENT) private document: Document,
    ) { }

    /**
     * Add: one step to value
     */
    public add(): void {
        this.change(1);
        this.changeByTimer(1);
    }

    /**
     * Subtract: one step from value
     */
    public sub(): void {
        this.change(-1);
        this.changeByTimer(-1);
    }

    /**
     * Update: value
     */
    public input(): void {
        this.onChange(this.value);
    }

    /**
     * Register: callback function to handle value changes
     */
    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    /**
     * Register: callback function to handle control touch events
     */
    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    /**
     * Set: disabled state
     */
    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    /**
     * Set: input element value
     */
    public writeValue(obj: any): void {
        if (typeof obj === 'number') {
            this.inputElement.value = obj.toString();
        } else {
            this.inputElement.value = '';
        }
    }

    /**
     * Change: value
     * @param direction - one of [-1, 1]
     */
    private change(direction: number): void {
        // -->Set: value
        let value = (this.value === '' || isNaN(this.value) ? 0 : this.value) + this.options.step * direction;

        // -->Check: if max option was specified
        if (this.options.max !== null) {
            // -->Guarantee: value is not bigger than max
            value = Math.min(this.options.max, value);
        }
        // -->Check: if min option was specified
        if (this.options.min !== null) {
            // -->Guarantee: value is not smaller than min
            value = Math.max(this.options.min, value);
        }

        // -->Check: if value changed
        if (value !== this.value) {
            // -->Update: value
            this.onChange(value);
            this.value = value;
        }
    }

    /**
     * Change: value by timer
     * @param direction - one of [-1, 1]
     */
    private changeByTimer(direction: number): void {
        let interval: ReturnType<typeof setInterval>;
        // -->Change: value after timer expires
        const timer = setTimeout(() => {
            // -->Set: interval
            interval = setInterval(() => this.change(direction), 50);
        }, 300);

        // -->Cancel: timer and interval on mouse up
        const documentMouseUp = () => {
            // -->Clear: timer
            clearTimeout(timer);
            // -->Clear: interval
            clearInterval(interval);

            // -->Remove: mouse up event listener
            this.document.removeEventListener('mouseup', documentMouseUp, false);
        };
        // -->Add: mouse up event listener
        this.document.addEventListener('mouseup', documentMouseUp, false);
    }
}
