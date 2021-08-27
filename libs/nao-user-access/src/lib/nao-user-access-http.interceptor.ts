import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NaoUserAccessService } from './nao-user-access.service';


@Injectable()
export class NaoUserAccessHttpInterceptor implements HttpInterceptor {
  constructor(
    // private readonly naoUserAccessService: NaoUserAccessService,
    private readonly router: Router
  ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /**
     * Add Http Auth directly to any connection
     */
    // request = request.clone({
    //   setHeaders: {
    //     // 'Content-Type' : 'application/json; charset=utf-8',
    //     // 'Accept'       : 'application/json',
    //     'X-NAO-AUTH': `Bearer ${this.naoHttp2ApiService.accessToken.token.getValue()}`,
    //     'Authorization': `Bearer ${this.naoHttp2ApiService.accessToken.token.getValue()}`,
    //   },
    // });
    // -->Check: if there's a user already logged in
    // if (this.naoUserAccessService.isLoggedIn() && this.naoUserAccessService.status) {
    //   let url: string;
    //   switch (this.naoUserAccessService.status) {
    //     case 'suspended':
    //       /**
    //        * Suspended access from My Account > Team
    //        */
    //       url = '/suspended';
    //       break;
    //     case 'blocked':
    //       /**
    //        * Blocked user
    //        */
    //       url = '/blocked';
    //       break;
    //     case 'restricted':
    //       /**
    //        * When the account isn't paid, the super admin becomes unpaid and everybody else is restricted
    //        */
    //       url = '/restricted';
    //       break;
    //     case 'unpaid':
    //       /**
    //        * When the super admin didn't pay, is late on billing or credit card expired
    //        */
    //       url = '/unpaid';
    //       break;
    //     case 'deleted':
    //       /**
    //        * A deleted user (this should never happen, but we might enable it in the future)
    //        */
    //       url = '/deleted';
    //       break;
    //   }
    //   if (typeof url === 'string') {
    //     this.router.navigateByUrl(url, { replaceUrl: true }).then();
    //   }
    // }
    // -->Handle: errors
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        // -->Check: if the header is a 401
        if (err && !isNaN(+err.status) && +err.status === 401) {
          let url = '/logout';
          if (err.error?.index === 'session_expired') {
            url = '/logout-expired';
          }
          this.router.navigateByUrl(url, { replaceUrl: true }).then();
        }
        // -->Rethrow: the error no matter what
        return throwError(err);
      })
    );
  }
}
