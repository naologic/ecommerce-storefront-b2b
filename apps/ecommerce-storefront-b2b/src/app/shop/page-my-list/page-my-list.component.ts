import { Component, OnInit } from '@angular/core';
import { NaoSettingsInterface } from "@naologic/nao-interfaces";
import { MyListsService } from '../../services/my-lists.service';
import { UrlService } from '../../services/url.service';
import { AppService } from "../../app.service";
import { ActivatedRoute } from '@angular/router';
import { ProductVariant } from '../../interfaces/product';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-page-my-list',
    templateUrl: './page-my-list.component.html',
    styleUrls: ['./page-my-list.component.scss'],
})
export class PageMyListComponent implements OnInit {
    private myListId: string;

    public myListName: string = "List Name"; // todo: get list name from data
    public emptyListHeader: string;
    public myListItems: ProductVariant[] = [];
    public refreshInProgress = true;

    public appSettings: NaoSettingsInterface.Settings;
        constructor(
            public myListsService: MyListsService,
            public url: UrlService,
            private appService: AppService,
            private route: ActivatedRoute,
            private translate: TranslateService,
        ) { }

    public ngOnInit(): void {
        // -->Set: app settings
        this.appSettings = this.appService.settings.getValue();

        this.route.params.subscribe(params => {
            console.log(params);
                // -->Set: my list id
                this.myListId = params.id;

                // todo: Remove or rework emptyListHeader when this page gets properly connected
                this.emptyListHeader = this.translate.instant('HEADER_MY_LISTS_EMPTY_TITLE', { listId: this.myListId })

                // -->Get: and refresh items
                this.refresh();
            }
        );
    }

    /**
     * Refresh: items on list
     */
    public refresh(): void {
        this.myListsService.get(this.myListId).subscribe((value) => {
            console.log("myList>>>", value);

            // todo: adapt after knowing more about my-list definition
            //  Assuming something like { _id: string, name: string, items: ProductVariant[] }

            // -->Check: value
            if(value) {
                // -->Set: myListName
                this.myListName = value.name;
                // -->Set: myListItems
                this.myListItems = value.items;

                // -->Done: loading
                this.refreshInProgress = false;
            }
        });
    }
}
