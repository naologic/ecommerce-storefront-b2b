import { Component, OnDestroy, OnInit } from "@angular/core";
import { AppService } from "../../app.service";
import { Subscription } from "rxjs";

@Component({
    selector: 'app-page-about-us',
    templateUrl: './page-about-us.component.html',
    styleUrls: ['./page-about-us.component.scss'],
})
export class PageAboutUsComponent implements OnInit, OnDestroy {
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
