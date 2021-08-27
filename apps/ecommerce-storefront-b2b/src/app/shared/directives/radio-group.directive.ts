import { Directive, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { RadiobuttonDispatcherService } from '../dispatchers/radiobutton-dispatcher.service';

@Directive({
    selector: '[appRadioGroup]',
    providers: [
        {
            provide: RadiobuttonDispatcherService,
            useClass: RadiobuttonDispatcherService,
        },
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => RadioGroupDirective),
            multi: true,
        },
    ],
})
export class RadioGroupDirective implements OnInit, OnDestroy, ControlValueAccessor {
    private destroy$: Subject<void> = new Subject();
    private value: any;
    private changeFn: any = () => {};

    constructor(
        private dispatcher: RadiobuttonDispatcherService,
    ) { }

    public ngOnInit(): void {
        this.dispatcher.change$.pipe(
            takeUntil(this.destroy$),
            filter(value => value !== this.value),
        ).subscribe(value => {
            this.value = value;
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
     * Set: value
     */
    public writeValue(value: any): void {
        this.value = value;
        this.dispatcher.value = value;
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
