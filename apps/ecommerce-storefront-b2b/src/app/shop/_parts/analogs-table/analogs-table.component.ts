import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { NaoSettingsInterface } from "@naologic/nao-interfaces";
import { UrlService } from '../../../services/url.service';
import { AppService } from "../../../app.service";
import { Product } from '../../../interfaces/product';

@Component({
    selector: 'app-analogs-table',
    templateUrl: './analogs-table.component.html',
    styleUrls: ['./analogs-table.component.scss'],
})
export class AnalogsTableComponent implements OnInit, OnDestroy {
    @Input() public set productId(value: number) {
        if (value !== this.productId$.value) {
            this.productId$.next(value);
        }
    }

    private destroy$: Subject<void> = new Subject<void>();
    private productId$: BehaviorSubject<number|null> = new BehaviorSubject<number|null>(null);

    public appSettings: NaoSettingsInterface.Settings;
    public analogs: Product[] = [];

    constructor(
        public url: UrlService,
        private appService: AppService,
    ) { }

    public ngOnInit(): void {
        // -->Set: app settings
        this.appSettings = this.appService.settings.getValue();

        // this.productId$.pipe(
        //     switchMap(productId => {
        //         if (!productId) {
        //             return of([]);
        //         }

        //         return this.shop.getProductAnalogs(productId);
        //     }),
        //     takeUntil(this.destroy$),
        // ).subscribe(x => this.analogs = x);
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
