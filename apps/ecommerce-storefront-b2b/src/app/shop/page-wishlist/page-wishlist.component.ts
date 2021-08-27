import { Component, OnInit } from '@angular/core';
import { NaoSettingsInterface } from "@naologic/nao-interfaces";
import { MyListsService } from '../../services/my-lists.service';
import { UrlService } from '../../services/url.service';
import { AppService } from "../../app.service";

@Component({
    selector: 'app-page-wishlist',
    templateUrl: './page-wishlist.component.html',
    styleUrls: ['./page-wishlist.component.scss'],
})
export class PageWishlistComponent implements OnInit {

public appSettings: NaoSettingsInterface.Settings;
    constructor(
        public wishlist: MyListsService,
        public url: UrlService,
        private appService: AppService,
    ) { }

    public ngOnInit(): void {
        // -->Set: app settings
        this.appSettings = this.appService.settings.getValue();
    }
}
