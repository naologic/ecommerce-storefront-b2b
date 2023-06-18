import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {NaoUserAccessService} from "../nao-user-access";
import {NaoHttp2ApiService} from "../nao-http2";
import {NaoDocumentInterface} from "../nao-interfaces";

@Injectable({
  providedIn: 'root'
})
export class AccountProfileService<T = any> {
  public readonly api = {root: 'users'};
  public readonly userAccessOptions;

  constructor(
    private readonly naoHttp2ApiService: NaoHttp2ApiService,
    private naoUsersService: NaoUserAccessService
  ) {
    this.userAccessOptions = this.naoUsersService.userAccessOptions;
  }

  /**
   * Get: account data information
   */
  public getAccountData(data?: any, naoQueryOptions = {
    docName: 'shop',
    cfpPath: 'ecommerce/ecommerce'
  }): Observable<T> {
    return this.naoHttp2ApiService.postJson<T>(`universal/ecommerce/data/get-account-information`, {
      data: {
        data,
        naoQueryOptions
      }
    });
  }

  /**
   * todo Update: user password
   */
  public updatePassword(data: {
    oldPassword: string,
    password: string,
    confirmPassword: string
  }, naoQueryOptions = {docName: 'doc', cfpPath: 'users/users', userMode: 'guest-external'}): Observable<T> {
    // -->Request: data browse
    return this.naoHttp2ApiService.postJson<T>(`universal/users/user/change-my-password`, {
      data: {
        data,
        naoQueryOptions
      }
    });
  }

  /**
   * todo Update: user data
   * @example
   * this.update('data', { addresses: [] })
   *
   * addresses works
   */
  public updateAccountData(mode: 'userAccount' | 'companyAccount' | 'addresses', data: Partial<T>, naoQueryOptions = {
    docName: 'shop',
    cfpPath: 'ecommerce/ecommerce'
  }): Observable<T> {
    // -->Request: user data
    return this.naoHttp2ApiService.postJson<T>(`universal/ecommerce/data/update-account-information`, {
      data: {data: {mode, ...data}, naoQueryOptions}
    });
  }


  /**
   * todo Delete: user account
   *
   * todo: WIP
   */
  public deleteAccount(password: string, naoQueryOptions = NaoDocumentInterface.naoQueryOptionsDefault(
    {docName: 'guest-external-ecommerce', userMode: 'guest-external'})
  ): Observable<T> {
    // -->Request: account delete
    return this.naoHttp2ApiService.postJson<T>(`${this.api.root}/guest/delete/document/account`, {
      data: {password},
      naoQueryOptions
    });
  }

  /**
   * todo Send: email for password reset
   * @deprecated
   */
  public sendResetPasswordEmail(email: string): Observable<T> {
    // -->Send: forgot password request
    return this.naoHttp2ApiService.postJson<T>(`${this.api.root}/guest/password/forgot/now`, {
      data: {email},
      naoQueryOptions: this.naoUsersService.userAccessOptions.naoQueryOptions
    });
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
