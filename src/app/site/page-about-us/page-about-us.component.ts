import { Component, OnDestroy, OnInit } from "@angular/core";
import { AppService } from "../../app.service";
import { Subscription } from "rxjs";
import {appInfo$} from "../../../app.static";

@Component({
    selector: 'app-page-about-us',
    templateUrl: './page-about-us.component.html',
    styleUrls: ['./page-about-us.component.scss'],
})
export class PageAboutUsComponent implements OnInit, OnDestroy {
    private subs = new Subscription();
    public aboutUs: string;

    constructor(
        public appService: AppService,
    ) { }

    public ngOnInit(): void {
        // -->Subscribe: to appInfo changes
        this.subs.add(
            appInfo$.subscribe(value => {
                // -->Set: generalSettings info
                this.aboutUs = value?.shopInfo?.about?.data?.text;
            })
        );
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
