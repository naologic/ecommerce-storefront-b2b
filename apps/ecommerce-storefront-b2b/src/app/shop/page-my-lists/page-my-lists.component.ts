import { Component, OnInit } from '@angular/core';
import { MyListsService } from '../../services/my-lists.service';
import { UrlService } from '../../services/url.service';
import { AppService } from "../../app.service";
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-page-my-lists',
    templateUrl: './page-my-lists.component.html',
    styleUrls: ['./page-my-lists.component.scss'],
})
export class PageMyListsComponent implements OnInit {
    public myLists: any[];

    constructor(
        public myListsService: MyListsService,
        public url: UrlService,
    ) { }

    public ngOnInit(): void {
        // -->Subscribe: to My Lists updates
        this.myListsService.myLists.subscribe((value) => {
            console.log("myLists>>>", value);
            this.myLists = value;
        })
    }
}
