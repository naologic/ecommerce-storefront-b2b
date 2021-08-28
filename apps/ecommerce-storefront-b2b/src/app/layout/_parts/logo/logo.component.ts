import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { AppService } from "../../../app.service";

@Component({
    selector: 'app-logo',
    templateUrl: './logo.component.html',
    styleUrls: ['./logo.component.scss'],
})
export class LogoComponent implements OnInit, OnDestroy {
    private subs = new Subscription();
    public generalSettings;

    constructor(
        public appService: AppService,
    ) { }

    public ngOnInit(): void {
        // -->Subscribe: to appInfo changes
        this.subs.add(
            this.appService.appInfo.subscribe(value => {
                // -->Set: generalSettings info
                this.generalSettings = value?.generalSettings;
            })
        );
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
