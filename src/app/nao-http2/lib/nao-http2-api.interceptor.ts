import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NaoHttp2ApiService } from './nao-http2-api.service';


@Injectable()
export class NaoHttp2ApiInterceptor implements HttpInterceptor {
  constructor(
    // private readonly $flow: $FlowService
    private readonly naoHttp2ApiService: NaoHttp2ApiService,
    private router: Router
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

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        // -->Check: if it's a valid NAO error
        if (err && err.error && err.ok === false) {
          // -->Check: for un-authorized
          if (!isNaN(+err.status) && +err.status === 401) {
            const toURL = err.error && err.error && err.error.expiredSession ? '/logout-expired' : '/logout';
            this.router.navigateByUrl(toURL, {
              // queryParams: {
              //   reason: 'unauthorized'
              // }
            }).then();
          }
          return throwError(err);
        } else {
          return throwError(err);
        }
      })
    );
  }
}
