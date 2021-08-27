import { Component, Input, OnDestroy, OnInit, Optional } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RadiobuttonDispatcherService } from '../dispatchers/radiobutton-dispatcher.service';

@Component({
    selector: 'app-radio-button',
    templateUrl: './radio-button.component.html',
    styleUrls: ['./radio-button.component.scss'],
})
export class RadioButtonComponent implements OnInit, OnDestroy {
    @Input() public value: any;
    @Input() public disabled = false;

    private destroy$: Subject<void> = new Subject();

    public state = {
        checked: false,
        disabled: false,
    };
    public name!: string;

    constructor(
        @Optional() public dispatcher: RadiobuttonDispatcherService,
    ) { }

    public ngOnInit(): void {
        // -->Check: dispatcher
        if (this.dispatcher) {
            // -->Set: name
            this.name = this.dispatcher.name;
            // -->Set: state checked value
            this.state.checked = this.value !== undefined && this.value === this.dispatcher.value;

            // -->Subscribe: to dispatcher changes
            this.dispatcher.change$.pipe(takeUntil(this.destroy$)).subscribe(newValue => {
                // --> Update: state checked value
                this.state.checked = this.value === newValue;
            });
        }
    }

    /**
     * Handle: input changes
     */
    public onChange(): void {
        if (this.dispatcher) {
            this.dispatcher.value = this.value;
        }
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
