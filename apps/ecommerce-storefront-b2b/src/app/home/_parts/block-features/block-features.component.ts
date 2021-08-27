import { Component, Input, OnInit } from '@angular/core';
import { NaoSettingsInterface } from "@naologic/nao-interfaces";
import { AppService } from "../../../app.service";

export type BlockFeaturesLayout = 'top-strip' | 'bottom-strip';

@Component({
    selector: 'app-block-features',
    templateUrl: './block-features.component.html',
    styleUrls: ['./block-features.component.scss'],
})
export class BlockFeaturesComponent implements OnInit {
    @Input() public layout: BlockFeaturesLayout = 'top-strip';

    public appSettings: NaoSettingsInterface.Settings;

    constructor(private appService: AppService,) { }

    public ngOnInit(): void {
        // -->Set: app settings
        this.appSettings = this.appService.settings.getValue();
    }
}
