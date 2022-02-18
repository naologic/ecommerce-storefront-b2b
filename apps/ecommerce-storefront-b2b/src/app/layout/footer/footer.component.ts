import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs";
import { AppService } from "../../app.service";

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit, OnDestroy {
    private subs = new Subscription();

    public infoSupport = null;

    // Newsletter social links
    public socialLinks = [
        
        { type: 'instagram', url: 'https://www.linkedin.com/company/1031475/admin/', icon: 'fab fa-linkedin' },
        { type: 'instagram', url: '', icon: 'fab fa-instagram' },
        { type: 'facebook',  url: '', icon: 'fab fa-facebook-f' }
        // { type: 'twitter',   url: '', icon: 'fab fa-twitter' },
        // { type: 'youtube',   url: '', icon: 'fab fa-youtube' },
    ];

    constructor(public appService: AppService) { }

    public ngOnInit(): void {
        this.subs.add(
            this.appService.appInfo.subscribe(value => {
                // -->Set: info
                this.infoSupport = value?.support?.supportInfo;
            })
        )
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }
}
