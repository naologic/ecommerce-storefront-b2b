import {BehaviorSubject} from "rxjs";
import {AppInterface} from "./app.interface";

export const appInfo$ = new BehaviorSubject<AppInterface.AppInfo>(null);




/*
    If you want to see the old appInfo, go to https://ecommerce-storefront-b2b.naologic.com,
    and look in the console at the Request URL: https://api-v2-bee11.naologic.com/api/v2/ecommerce-api-public/info/get/doc/data

    This request is made any time you refresh the browser and there's no data stored locally.




 */
// todo: move this to a libs/config after upgrading nx.dev
