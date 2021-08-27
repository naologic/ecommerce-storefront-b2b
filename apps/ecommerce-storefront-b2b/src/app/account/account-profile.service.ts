import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NaoUserAccessService } from "@naologic/nao-user-access";
import { NaoHttp2ApiService } from "@naologic/nao-http2";
import { NaoDocumentInterface } from "@naologic/nao-interfaces";

@Injectable({
    providedIn: 'root'
})
export class AccountProfileService<T = any> {
    public readonly api = { root: 'users' };
    public readonly userAccessOptions;

    constructor(
        private readonly naoHttp2ApiService: NaoHttp2ApiService,
        private naoUsersService: NaoUserAccessService
    ) {
        this.userAccessOptions = this.naoUsersService.userAccessOptions;
    }

    /**
     * Update: user data
     * @example
     * this.update('data', { addresses: [] })
     */
    public update(mode: 'profile'|'addresses'|'order', data: Partial<T>, naoQueryOptions = NaoDocumentInterface.naoQueryOptionsDefault(
        { docName: 'guest-external-ecommerce', userMode: 'guest-external' })
    ): Observable<T> {
        // -->Request: user data
        return this.naoHttp2ApiService.postJson<T>(`${this.api.root}/guest/update/${naoQueryOptions.docName}/data`, {
            data: { data, mode, naoQueryOptions: this.userAccessOptions.naoQueryOptions, cfpPath: this.userAccessOptions.cfpPath },
            naoQueryOptions
        });
    }

    /**
     * Update: user password
     */
    public updatePassword(data: {currentPassword: string, password: string, confirmPassword: string}, naoQueryOptions = NaoDocumentInterface.naoQueryOptionsDefault(
        { docName: 'guest-external-ecommerce', userMode: 'guest-external' })
    ): Observable<T> {
        // -->Request: data browse
        return this.naoHttp2ApiService.patchJson<T>(`${this.api.root}/guest/password/${naoQueryOptions.docName}/update`, { data: {data}, naoQueryOptions });
    }

    /**
     * Delete: user account
     */
    public deleteAccount(password: string, naoQueryOptions = NaoDocumentInterface.naoQueryOptionsDefault(
        { docName: 'guest-external-ecommerce', userMode: 'guest-external' })
    ): Observable<T> {
        // -->Request: account delete
        return this.naoHttp2ApiService.postJson<T>(`${this.api.root}/guest/delete/document/account`, { data: { password }, naoQueryOptions });
    }

    /**
     * Send: email for password reset
     */
    public sendResetPasswordEmail(email: string): Observable<T> {
        // -->Send: forgot password request
        return this.naoHttp2ApiService.postJson<T>(`${this.api.root}/guest/password/forgot/now`, { data: { email }, naoQueryOptions: this.naoUsersService.userAccessOptions.naoQueryOptions });
    }

    // /**
    //  * Check the token for password reset
    //  */
    // public checkPasswordResetToken(token: string): Observable<T> {
    //   // -->Check: this invite
    //   return this.naoHttp2ApiService.postJson<T>(`users-auth-sso/password/forgot/check`, { data: { token }, naoQueryOptions: this.naoUsersService.userOptions.naoQueryOptions });
    // }
    //
    // /**
    //  * Reset the password and set the new one
    //  */
    // public resetPassword(token: string, password: string, confirmPassword: string): Observable<T> {
    //   // -->Check: this invite
    //   return this.naoHttp2ApiService.postJson<T>(`users-auth-sso/password/forgot/reset`, { data: { token, password, confirmPassword }, naoQueryOptions: this.naoUsersService.userOptions.naoQueryOptions });
    // }
}
