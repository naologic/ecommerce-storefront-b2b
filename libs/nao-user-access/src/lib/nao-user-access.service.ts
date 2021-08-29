import { Inject, Injectable } from '@angular/core';
import { NaoHttp2ApiService } from '@naologic/nao-http2';
import { TranslateService } from '@ngx-translate/core';
// import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { checkSessionData, NaoUserAccessData } from './nao-user-access.static';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, share } from 'rxjs/operators';
import { NaoUserAccessInterface, NaoUsersInterface} from './nao-user-access.interface';
import { CurrencyData, naoAccessToken$ } from '@naologic/nao-utils';

@Injectable({
    providedIn: 'root'
})
export class NaoUserAccessService {
    public readonly api = { root: 'users-auth' };
    private subs = new Subscription();
    get locale(): Observable<NaoUserAccessInterface.Locale> { return NaoUserAccessData.locale.pipe(distinctUntilChanged(), share()); }
    get accessToken(): BehaviorSubject<string> { return naoAccessToken$; }
    get userId(): BehaviorSubject<string> { return NaoUserAccessData.userId; }
    get userData(): BehaviorSubject<NaoUsersInterface.UserData> { return NaoUserAccessData.userData; }
    get linkedDoc(): BehaviorSubject<NaoUsersInterface.LinkedDoc> { return NaoUserAccessData.linkedDoc; }
    get roleData(): BehaviorSubject<NaoUsersInterface.Role> { return NaoUserAccessData.roleData; }
    get ads(): BehaviorSubject<any> { return NaoUserAccessData.ads; }
    get oldRoleData(): BehaviorSubject<NaoUsersInterface.Role> { return NaoUserAccessData.oldRoleData; }
    get isLoggedIn$(): BehaviorSubject<boolean> { return NaoUserAccessData.isLoggedIn$; }

    get status(): string { return this.userData.getValue() ? this.userData.getValue().status : null; }
    get state(): string { return this.userData.getValue() ? this.userData.getValue().state : null; }
    get isSuspended(): boolean { return typeof this.state === 'string' ? this.state.startsWith('suspended') : false; }
    get isUserLocked(): boolean { return this.state === 'locked'; }


    constructor(
        @Inject('localeData') public readonly localeData,
        @Inject('userAccessOptions') public readonly userAccessOptions,
        private readonly naoHttp2ApiService: NaoHttp2ApiService,
        private readonly translateService: TranslateService,
        // private readonly bsLocaleService: BsLocaleService,
    ) {
        if (this.userAccessOptions.naoQueryOptions) {
            // -->Set: default query options
            NaoUserAccessData.defaultNaoQueryOptions = this.userAccessOptions.naoQueryOptions;
        }
    }

    /**
     * Redirect user according to the flags
     */
    public checkUserAndRedirect(): { ok: boolean, redirectTo: string, canLoad: boolean } {
        const res = { redirectTo: '/account/login', ok: true, canLoad: true };
        // -->Check: if user is logged in
        if (!this.isLoggedIn()) {
            res.redirectTo = '/account/login';
            res.ok = false;
            res.canLoad = false;
        } else {
            const state = this.userData?.getValue()?.state;
            switch (state) {
                case 'active':
                    res.redirectTo = null; res.ok = true; res.canLoad = true;
                    break;
            }
        }
        return res;
    }

    /**
     * Init the access levels
     */
    public async init(): Promise<{ ok: boolean}> {
        // -->Apply: default locale
        return this.applyLocale();
    }

    /**
     * Check if current user is logged in
     */
    public isLoggedIn(): boolean {
        return this.isLoggedIn$.getValue() === true;
    }

    /**
     * Refresh user data
     */
    public async refreshSessionData(
        naoQueryOptions = NaoUserAccessData.defaultNaoQueryOptions
    ): Promise<{ ok: boolean }> {
        // -->Request: user login
        const sessionData = await this.naoHttp2ApiService.postJson<any>(`${this.api.root}/auth/refresh/${naoQueryOptions.docName}/data`, { data: {}, naoQueryOptions }).toPromise();
        // -->Return
        if (checkSessionData(sessionData)) {
            // -->Set: session data
            NaoUserAccessData.sessionStorage.setObject(NaoUserAccessData.sessionDataKey, sessionData);
            // -->Set: locale @NOTE: commented this until we add the locale settings as they match the ones below!
            // NaoUserAccessData.locale.next(sessionData.userData?.data?.locale);
            // -->Set: locale
            NaoUserAccessData.locale.next({ lang: 'en', currencyCode: 'USD', countryCode: 'USA' });
            // -->Set: user data
            NaoUserAccessData.companyData.next(sessionData.companyData);
            // -->Set: user data
            NaoUserAccessData.companyId.next(sessionData.companyData?._id);
            // -->Set: user data
            NaoUserAccessData.userData.next(sessionData.userData?.data);
            // -->Set: user data
            NaoUserAccessData.userId.next(sessionData.userData?._id);
            // -->Set: role data
            NaoUserAccessData.roleData.next(sessionData.roleData?.data);
            // -->Set: ads data
            NaoUserAccessData.ads.next(sessionData.ads);
            // -->Set: Linkedin account
            NaoUserAccessData.linkedDoc.next(sessionData.linkedDoc);
            // -->Apply: locale
            await this.applyLocale();
            // -->Return
            return { ok: true };
        } else {
            //  -->Logout
            return this.logout(naoQueryOptions);
        }
    }

    /**
     * Apply currently selected locale
     */
    public async applyLocale(): Promise<{ ok: boolean }> {
        // -->Get: the locale value
        const locale = NaoUserAccessData.locale.getValue();
        // -->Set: language codes to services
        if (locale && locale.lang) {
            // -->Get: the country info by code
            const language = this.localeData.activeLanguageList.find(c => c.lang === locale.lang);
            if (!language) {
                throw new Error(`Language with code ${locale.lang} was not found!`);
            }
            // -->Set: datepicker language
            // this.bsLocaleService.use(language.localeDate);
            // -->Update: language
            this.translateService.use(language.lang);
        }
        // -->Return
        return { ok: true };
    }

    /**
     * Get locale info
     */
    public getLocale(
        type: 'currency' | 'language' | 'country' | 'lang'
    ): any {
        switch (type) {
            case 'country':
                return this.localeData.activeCountryList.find(c => c.countryCode === NaoUserAccessData.locale.getValue().countryCode) || null;
            case 'currency':
                return this.localeData.activeCurrencyList.find(c => c.currencyCode === NaoUserAccessData.locale.getValue().currencyCode) || null;
            case 'language':
                return this.localeData.activeLanguageList.find(c => c.lang === NaoUserAccessData.locale.getValue().lang) || null;
            case 'lang':
                return NaoUserAccessData.locale.getValue().lang;
        }
    }

    /**
     * Find currency
     */
    public findCurrency(currencyCode: string): CurrencyData {
        if (this.localeData && Array.isArray(this.localeData.activeCurrencyList)) {
            return this.localeData.activeCurrencyList.filter(c => c.currencyCode === currencyCode)[0] || null;
        }
        return null;
    }

    /**
     * Set a locale setting
     */
    public async setLocale(
        type: 'country'|'currency'|'language',
        data: { code: string }
    ): Promise<{ ok: boolean }> {
        let data$: any = {};
        if (!this.localeData) {
            throw new Error(`No localeData found. Bad configs!`);
        }
        if (!Array.isArray(this.localeData.activeCountryList)) {
            throw new Error(`No activeCountryList[] provided in the localeData`);
        }
        if (!Array.isArray(this.localeData.activeCurrencyList)) {
            throw new Error(`No activeCurrencyList[] provided in the localeData`);
        }
        if (!Array.isArray(this.localeData.activeLanguageList)) {
            throw new Error(`No activeLanguageList[] provided in the localeData`);
        }
        if (type === 'country') {
            // -->Get: the country info by code
            const country = this.localeData.activeCountryList.find(c => c.countryCode === data.code);
            if (!country) {
                throw new Error(`Invalid country code sent! Check activeCountryList[] and try again`);
            }
            data$ = { countryCode: data.code };
            // -->Update: locale
            NaoUserAccessData.locale.next({ ...NaoUserAccessData.locale.getValue(), ...data$ });
        } else if (type === 'currency') {
            // -->Get: the country info by code
            const currency = this.localeData.activeCurrencyList.find(c => c.currencyCode === data.code);
            if (!currency) {
                throw new Error(`Invalid country code sent! Check activeCountryList[] and try again`);
            }
            data$ = { currencyCode: data.code };
            // -->Update: locale
            NaoUserAccessData.locale.next({ ...NaoUserAccessData.locale.getValue(), ...data$ });
        } else if (type === 'language') {
            // -->Get: the country info by code
            const language = this.localeData.activeLanguageList.find(c => c.lang === data.code);
            if (!language) {
                throw new Error(`Invalid country code sent! Check activeCountryList[] and try again`);
            }
            // -->Set: data
            data$ = { lang: data.code };
            // -->Update: locale
            NaoUserAccessData.locale.next({ ...NaoUserAccessData.locale.getValue(), ...data$ });
        }
        return { ok: true };
    }

    /**
     * Login with email/pass
     */
    public loginWithEmail(
        email: string,
        password: string,
        rememberMe: boolean,
        naoQueryOptions = NaoUserAccessData.defaultNaoQueryOptions
    ): Promise<{ ok: boolean }> {
        // -->Request: user login
        return this.naoHttp2ApiService.postJson<NaoUserAccessInterface.LoginResponse>(
            `${this.api.root}-public/public/login/${naoQueryOptions.docName}/email`, { data: { email, password }, naoQueryOptions })
            .toPromise<NaoUserAccessInterface.LoginResponse>()
            .then(loginData => {
                // -->Return
                return this.updateAccessTokenData(loginData, rememberMe);
            })
            .then((res) => {
                if (res.ok) {
                    // -->Return
                    return this.refreshSessionData(naoQueryOptions);
                } else {
                    return this.logout(naoQueryOptions);
                }
            });
    }

    /**
     * Login with existing token and refresh the session
     */
    public async loginWithToken(
        naoQueryOptions = NaoUserAccessData.defaultNaoQueryOptions
    ): Promise<{ ok: boolean }> {
        // -->Check: cached data
        const loginData = NaoUserAccessData.userStorage.getObject(NaoUserAccessData.accessTokens);
        // -->Check: tokens
        if (!loginData) {
            return { ok: false };
        }
        // -->Check: login token
        if (typeof loginData.accessToken !== 'string' || typeof loginData.resetToken !== 'string') {
            return { ok: false };
        }
        // -->Reset: the session
        return this.naoHttp2ApiService.postJson(`${this.api.root}/auth/reset/${naoQueryOptions.docName}/session`, { data: { resetToken: loginData.resetToken }, naoQueryOptions })
            .toPromise()
            .then(loginData$ => {
                if (loginData$) {
                    // -->Return
                    return this.updateAccessTokenData(loginData$, !!loginData.rememberMe);
                } else {
                    return { ok: false };
                }
            })
            .then((res) => {
                if (res.ok) {
                    // -->Return
                    return this.refreshSessionData(naoQueryOptions);
                } else {
                    return this.logout(naoQueryOptions);
                }
            });
    }

    /**
     * Set access token that will be used in all future HTTP requests
     */
    public async updateAccessTokenData(
        loginData: any,
        rememberMe = false
    ): Promise<{ ok: boolean }> {
        if (loginData && typeof loginData.accessToken === 'string' && typeof loginData.resetToken === 'string') {
            // -->Set: rememberMe flag
            loginData.rememberMe = rememberMe;
            // -->Set: tokens
            NaoUserAccessData.userStorage.setObject(NaoUserAccessData.accessTokens, loginData);
            // -->Set: observable
            naoAccessToken$.next(loginData.accessToken);
            // -->Set: logged in
            NaoUserAccessData.isLoggedIn$.next(true);
            // -->Return
            return { ok: true };
        } else {
            // -->Get: Token
            return { ok: false };
        }
    }

    /**
     * Logout
     */
    public async logout(
        naoQueryOptions = NaoUserAccessData.defaultNaoQueryOptions
    ): Promise<{ ok: boolean }> {
        if (!NaoUserAccessData.isLoggedIn$.getValue()) {
            // -->Clear; the data
            this.clearLoginData();
            // -->Ok
            return { ok: true };
        }
        // -->Logout
        return this.naoHttp2ApiService.postJson<{ ok: boolean }>(`${this.api.root}/auth/logout/${naoQueryOptions.docName}/email`, {})
            .toPromise()
            .then(() => {
                // -->Clear: the store
                this.clearLoginData();
                // -->Clear: the store
                return { ok: true };
            })
            .catch(err => {
                // -->Clear: the store
                this.clearLoginData();
                // -->ReturnL false
                return { ok: false };
            });
    }

    /**
     * Lock user access with password
     */
    public lockWithPassword(
        naoQueryOptions = NaoUserAccessData.defaultNaoQueryOptions
    ): Promise<{ ok: boolean }> {
        // -->Request: lock
        return this.naoHttp2ApiService.postJson<{ ok: boolean }>(`${this.api.root}/auth/session/${naoQueryOptions.docName}/lock`, { data: {}, naoQueryOptions }).toPromise().then(res => {
            // -->Refresh: session data
            return this.refreshSessionData();
        });
    }

    /**
     * Unlock user access with password
     */
    public unlockWithPassword(
        password: string,
        naoQueryOptions = NaoUserAccessData.defaultNaoQueryOptions
    ): Promise<any> {
        // -->Request: lock
        return this.naoHttp2ApiService.postJson<{ ok: boolean }>(`${this.api.root}/auth/session/${naoQueryOptions.docName}/unlock`, { data: { password }, naoQueryOptions }).toPromise();
    }

    /**
     * Clear all the login data
     * @private
     */
    private clearLoginData(): void {
        NaoUserAccessData.userStorage.clear();
        NaoUserAccessData.sessionStorage.clear();
        // -->Flush: again
        NaoUserAccessData.isLoggedIn$.next(false);
        NaoUserAccessData.userId.next(null);
        NaoUserAccessData.userData.next(null);
        naoAccessToken$.next(null);
        NaoUserAccessData.roleData.next(null);
    }
}
