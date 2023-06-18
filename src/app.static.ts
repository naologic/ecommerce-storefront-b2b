import { BehaviorSubject } from "rxjs";
import {  AppInterface } from "./app.interface";

/**
 * App: information
 */
// @ts-ignore
export const appInfo$ = new BehaviorSubject<AppInterface.AppInfo>(null);

/**
 * Account data is the document attached to this user where we have extra information
 *  - Used to show the profile data and addresses
 */
// @ts-ignore
export const accountData$ = new BehaviorSubject<AppInterface.AccountData|null>(null);


/*
    If you want to see the old appInfo, go to https://ecommerce-storefront-ssr.naologic.com,
    and look in the console at the Request URL: https://api-v2-bee11.naologic.com/api/v2/ecommerce-api-public/info/get/doc/data

    This request is made any time you refresh the browser and there's no data stored locally.




 */
// todo: move this to a libs/config after upgrading nx.dev
