import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {AppService} from "../../app.service";
import {appInfo$} from "../../../app.static";

@Component({
    selector: 'app-terms',
    templateUrl: './terms.component.html',
    styleUrls: ['./terms.component.scss'],
})
export class TermsComponent implements OnInit, OnDestroy {
    private subs = new Subscription();
    public termsText: string;

    constructor(
        public appService: AppService,
    ) {
    }

    public ngOnInit(): void {
        // -->Subscribe: to appInfo changes
        this.subs.add(
            appInfo$.subscribe(value => {
                // -->Set: generalSettings info
                this.termsText = value?.shopInfo?.termsAndConditions?.data?.text;
            })
        );
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
