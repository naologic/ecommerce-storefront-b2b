import {
    Component,
    EventEmitter,
    forwardRef,
    Input,
    OnDestroy,
    OnInit,
    Optional,
    Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CheckboxDispatcherService } from '../dispatchers/checkbox-dispatcher.service';

let uniqueId = 0;

@Component({
    selector: 'app-checkbox',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
    exportAs: 'appCheckbox',
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => CheckboxComponent),
            multi: true,
        },
    ],
})
export class CheckboxComponent implements OnInit, OnDestroy, ControlValueAccessor {
    @Input() public disabled = false;
    @Input() public value: any;
    @Input()
    public set checked(value: boolean) {
        this.stateChecked = value;
    }

    private destroy$: Subject<void> = new Subject<void>();
    private readonly dataId: number;
    private stateChecked = false;
    private changeFn: (_: boolean) => void = () => {};
    private touchedFn: () => void = () => {};

    // eslint-disable-next-line @angular-eslint/no-output-native
    @Output() public readonly change: EventEmitter<CheckboxComponent> = new EventEmitter<CheckboxComponent>();

    public get checked(): boolean {
        return this.stateChecked;
    }

    public get inputId(): string {
        return `app-checkbox-id-${this.dataId}`;
    }

    constructor(
        @Optional() private dispatcher: CheckboxDispatcherService,
    ) {
        this.dataId = ++uniqueId;
    }

    public ngOnInit(): void {
        if (this.dispatcher) {
            // -->Check: if dispatcher contains value
            const checked2 = this.dispatcher.value.indexOf(this.value) !== -1;

            // -->Update: checked value if different
            this.checkAndUpdateValue(checked2);

            // -->Subscribe: to dispatcher value changes
            this.dispatcher.change$.pipe(
                takeUntil(this.destroy$),
            ).subscribe(value => {
                // -->Check: if dispatcher contains value
                const checked = value.indexOf(this.value) !== -1;

                // -->Update: checked value if different
                this.checkAndUpdateValue(checked);
            });
        }
    }

    /**
     * Handle: value change
     */
    public onInputChange(event: Event): void {
        event.stopPropagation();

        // -->Set: checked
        this.checked = (event.target as HTMLInputElement).checked;
        // -->Emit: component
        this.change.emit(this);
        // -->Trigger: change callback function
        this.changeFn(this.checked);

        // -->Check: dispatcher
        if (this.dispatcher) {
            if (this.checked && this.dispatcher.value.indexOf(this.value) === -1) {
                // -->Add: value to dispatcher
                this.dispatcher.value = [...this.dispatcher.value, this.value];
            } else if (!this.checked && this.dispatcher.value.indexOf(this.value) !== -1) {
                // -->Remove: value from dispatcher
                this.dispatcher.value = this.dispatcher.value.filter(x => x !== this.value);
            }
        }
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
     * Set: disabled state
     */
    public setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    /**
     * Set: checked value
     */
    public writeValue(value: boolean): void {
        this.checked = !!value;
    }

    /**
     * Update: checked value if different
     */
    private checkAndUpdateValue(checked: boolean): void {
        if (this.checked !== checked) {
            this.checked = checked;
            this.change.emit(this);
            this.changeFn(this.checked);
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
