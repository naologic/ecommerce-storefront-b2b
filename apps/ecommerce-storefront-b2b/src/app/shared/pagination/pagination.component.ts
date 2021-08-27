import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    styleUrls: ['./pagination.component.scss'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => PaginationComponent),
            multi: true,
        },
    ],
})
export class PaginationComponent implements OnInit, OnChanges, ControlValueAccessor {
    @Input() public siblings = 1;
    @Input() public current = 1;
    @Input() public total = 1;

    private onChange: any = () => {};
    private onTouched: any = () => {};

    @Output() public pageChange: EventEmitter<number> = new EventEmitter();

    public pages: number[] = [];

    constructor() { }

    public ngOnInit(): void {
        this.calc();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        this.calc();
    }

    /**
     * Set: current page
     */
    public setPage(value: number, emitEvent: boolean = true): void {
        this.onTouched();

        // -->Check: value or if page change is needed
        if (value < 1 || value > this.total || value === this.current) {
            return;
        }

        // -->Set: current page
        this.current = value;

        if (emitEvent) {
            // -->Handle: page value change
            this.onChange(value);
        }

        // -->Compute: pages
        this.calc();

        if (emitEvent) {
            // -->Emit: current page
            this.pageChange.emit(this.current);
        }
    }

    /**
     * Compute: pages
     */
    private calc(): void {
        const min = Math.max(1, this.current - this.siblings - Math.max(0, this.siblings - this.total + this.current));
        const max = Math.min(this.total, min + this.siblings * 2);

        // -->Init: pages
        this.pages = [];

        // -->Push: first pages
        for (let i = 1; i <= Math.min(min - 1, 1); i++) {
            this.pages.push(i);
        }

        // -->Check: if page break is needed
        if (min - 1 >= 3) {
            // -->Push: page break (dots)
            this.pages.push(0);
        } else if (min - 1 >= 2) {
            this.pages.push(min - 1);
        }

        // -->Push: between pages
        for (let i = min; i <= max; i++) {
            this.pages.push(i);
        }

        // -->Check: if page break is needed
        if (max + 1 <= this.total - 2) {
            // -->Push: page break (dots)
            this.pages.push(0);
        } else if (max + 1 <= this.total - 1) {
            this.pages.push(max + 1);
        }

        // -->Push: last pages
        for (let i = Math.max(max + 1, this.total); i <= this.total; i++) {
            this.pages.push(i);
        }
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
     * Set: page value
     */
    public writeValue(obj: any): void {
        if (typeof obj === 'number') {
            this.setPage(obj, false);
        }
    }
}
