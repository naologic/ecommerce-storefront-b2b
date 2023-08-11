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

/**
 * Store all the watchers in static
 */
export const AppStatic$ = {
  windowDetails: new BehaviorSubject<AppInterface.WindowDetails>({
    innerScreen: { width: 0, height: 0 }, screen: { width: 0, height: 0 }, devicePixelRatio: 1, isApple: false }
  ),
};


/*
    If you want to see the old appInfo, go to https://ecommerce-storefront-ssr.naologic.com,
    and look in the console at the Request URL: https://api-v2-bee11.naologic.com/api/v2/ecommerce-api-public/info/get/doc/data

    This request is made any time you refresh the browser and there's no data stored locally.




 */
// todo: move this to a libs/config after upgrading nx.dev
