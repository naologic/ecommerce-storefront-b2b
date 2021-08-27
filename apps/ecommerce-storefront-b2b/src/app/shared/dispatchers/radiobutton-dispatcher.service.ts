import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

let uniqueId = 0;

@Injectable()
export class RadiobuttonDispatcherService {
    private readonly id: number;
    private valueState: any;
    private changeSubject$: Subject<any> = new Subject<any>();

    public change$: Observable<any> = this.changeSubject$.asObservable();

    public get name() {
        return `app-radio-button-${this.id}`;
    }

    public get value(): any {
        return this.valueState;
    }
    public set value(value: any) {
        if (value !== this.valueState) {
            this.valueState = value;
            this.changeSubject$.next(value);
        }
    }

    constructor() {
        this.id = ++uniqueId;
    }
}
