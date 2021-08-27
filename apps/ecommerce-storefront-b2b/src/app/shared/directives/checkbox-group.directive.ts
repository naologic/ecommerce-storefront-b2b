import { Directive, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CheckboxDispatcherService } from '../dispatchers/checkbox-dispatcher.service';

@Directive({
    selector: '[appCheckboxGroup]',
    providers: [
        {
            provide: CheckboxDispatcherService,
            useClass: CheckboxDispatcherService,
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxGroupDirective),
            multi: true,
        },
    ],
})
export class CheckboxGroupDirective implements OnInit, OnDestroy, ControlValueAccessor {
    private destroy$: Subject<void> = new Subject();
    private changeFn: any = () => {};

    constructor(
        private dispatcher: CheckboxDispatcherService,
    ) { }

    public ngOnInit(): void {
        this.dispatcher.change$.pipe(takeUntil(this.destroy$)).subscribe(value => {
            this.changeFn(value);
        });
    }

    /**
     * Register: callback function to handle changes
     */
    public registerOnChange(fn: any): void {
        this.changeFn = fn;
    }

    /**
     * Register: callback function to handle control touch events
     */
    public registerOnTouched(fn: any): void { }

    /**
     * Set: disabled state
     */
    public setDisabledState(isDisabled: boolean): void { }

    /**
     * Set: dispatcher value
     */
    public writeValue(value: any[]): void {
        this.dispatcher.value = value;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
