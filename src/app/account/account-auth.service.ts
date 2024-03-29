import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {NaoHttp2ApiService} from "../nao-http2";
import {NaoDocumentInterface} from "../nao-interfaces";
import {NaoUserAccessService} from "../nao-user-access";
import {first} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AccountAuthService<T = any> {
  private get apiRoot(): string {
    return this.naoUsersService.isLoggedIn() ? 'universal' : 'universal-public';
  }

  public readonly userAccessOptions;

  constructor(
    private readonly naoHttp2ApiService: NaoHttp2ApiService,
    private naoUsersService: NaoUserAccessService
  ) {
    this.userAccessOptions = this.naoUsersService.userAccessOptions;
  }

  /**
   * Create: new user
   */
  public createUser(data: any, naoQueryOptions = NaoDocumentInterface.naoQueryOptionsDefault({
    docName: 'shop',
    cfpPath: 'ecommerce/ecommerce',
    userMode: 'guest-external'
  })): Observable<T> {
    return this.naoHttp2ApiService.postJson<T>(`universal-public/ecommerce/data/register-ecommerce-user`, {
      data: {
        data,
        naoQueryOptions
      }
    });
  }

  /**
   * Send: email for password reset
   */
  public sendResetPasswordEmail(email: string, naoQueryOptions = NaoDocumentInterface.naoQueryOptionsDefault({
    docName: 'doc',
    cfpPath: 'users/users',
    userMode: 'guest-external'
  })) {

    alert(`not done yet`)
    return this.naoHttp2ApiService.postJson<T>(`${this.apiRoot}/ecommerce/data/get-public-store-information`, {
      data: {
        data: {email},
        naoQueryOptions
      }
    });
  }

  /**
   * Ensure user data
   */
  public ensureUserData(data: any, naoQueryOptions = NaoDocumentInterface.naoQueryOptionsDefault({
    docName: 'shop',
    cfpPath: 'ecommerce/ecommerce',
    userMode: 'guest-external'
  })) {
    return this.naoHttp2ApiService.postJson<T>(`universal/ecommerce/data/ensure-ecommerce-user`, {
      data: {
        data,
        naoQueryOptions
      }
    }).pipe(first()).toPromise()
  }
}
