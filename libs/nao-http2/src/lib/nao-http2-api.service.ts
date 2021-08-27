import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, first } from 'rxjs/operators';
import { generateApiRoute } from './nao-http2.utils';
import { naoAccessToken$ } from '@naologic/nao-utils';
// @ts-nocheck

export interface HttpOptions {
    headers?: HttpHeaders | {
        [header: string]: string | string[];
    };
    observe: 'body';
    params?: HttpParams | {
        [param: string]: string | string[];
    };
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
}

export enum HttpReponseType {
    arraybuffer = 'arraybuffer',
    json = 'json',
    blob = 'blob',
    pdf = 'application/pdf',
}

export enum HttpRequestType {
    json = 'application/json',
    data = 'multipart/form-data'
}

@Injectable({
  providedIn: 'root'
})
export class NaoHttp2ApiService extends HttpClient {
  private readonly api: { url: string, basicAuth: string, ok: boolean, naoToken: string };

  get accessToken(): string {  return naoAccessToken$.getValue(); }

  constructor(
    handler: HttpHandler,
    @Inject('apiConfig') private readonly apiConfig: any,
  ) {
    // -->Init: http handler
    super(handler);
    // -->Set: api
    this.api = {
      url: `${this.apiConfig.server.protocol}://${this.apiConfig.server.url}:${this.apiConfig.server.port}/${this.apiConfig.server.prefix}`,
      basicAuth: btoa(`${this.apiConfig.basicAuth.user}:${this.apiConfig.basicAuth.password}`),
      naoToken: this.apiConfig.naoToken,
      ok: true
    };
  }

  /**    --------------------------------
   *          Standard HTTP requests (no unsubscribe needed)
   *     --------------------------------
   */
  public getJson<T>(uri: string, params?: any): Observable<T> {
    // -->Send: request
    return this.getJson$<T>(uri, params).pipe(first());
  }

  public postJson<T>(uri: string, data: any, params?: any, responseType?: HttpReponseType, requestType?: HttpRequestType): Observable<T> {
    return this.postJson$<T>(uri, data, params, responseType, requestType).pipe(first());
  }

  public putJson<T>(uri: string, data: any, params?: any): Observable<T> {
    return this.putJson$<T>(uri, data, params).pipe(first());
  }

  public patchJson<T>(uri: string, data: any, params?: any): Observable<T> {
    return this.patchJson$<T>(uri, data, params).pipe(first());
  }

  public headJson<T>(uri: string, params?: any): Observable<T> {
    return this.headJson$<T>(uri, params).pipe(first());
  }

  public deleteJson<T>(uri: string, params?: any): Observable<T> {
    return this.deleteJson$<T>(uri, params).pipe(first());
  }

  public optionsJson<T>(uri: string, params?: any): Observable<T> {
    return this.optionsJson$<T>(uri, params).pipe(first());
  }

  /**    --------------------------------
   *          Observable HTTP requests
   *     --------------------------------
   */
  public getJson$<T>(uri: string, params?: any): Observable<T> {
    // -->Send: request
      // @ts-ignore
      return super.get<T>(this.getUrl(uri), this.getOptions(params)).pipe(catchError(this.handleError.bind(this)));
  }

  public postJson$<T>(uri: string, data: any, params?, responseType?: HttpReponseType, requestType?: HttpRequestType): Observable<T> {
    // @ts-ignore
      return super.post<T>(this.getUrl(uri), data, this.getOptions(params, responseType, requestType)).pipe(catchError(this.handleError.bind(this)));
  }

  public putJson$<T>(uri: string, data: any, params?): Observable<T> {
    // @ts-ignore
      return super.put<T>(this.getUrl(uri), data, this.getOptions(params)).pipe(catchError(this.handleError.bind(this)));
  }

  public patchJson$<T>(uri: string, data: any, params?): Observable<T> {
    // @ts-ignore
      return super.patch<T>(this.getUrl(uri), data, this.getOptions(params)).pipe(catchError(this.handleError.bind(this)));
  }

  public headJson$<T>(uri: string, params?): Observable<T> {
    // @ts-ignore
      return super.head<T>(this.getUrl(uri), this.getOptions(params)).pipe(catchError(this.handleError.bind(this)));
  }

  public deleteJson$<T>(uri: string, params?): Observable<T> {
    // @ts-ignore
      return super.delete<T>(this.getUrl(uri), this.getOptions(params)).pipe(catchError(this.handleError.bind(this)));
  }

  public optionsJson$<T>(uri: string, params?): Observable<T> {
    // @ts-ignore
      return super.options<T>(this.getUrl(uri), this.getOptions(params)).pipe(catchError(this.handleError.bind(this)));
  }


  /**    --------------------------------
   *          File HTTP requests
   *     --------------------------------
   */
  private fileGet<T>(uri: string, responseType: HttpReponseType = HttpReponseType.blob, params?): Observable<T> {
    // @ts-ignore
      return super.get<T>(this.getUrl(uri), this.getOptions(params, responseType)).pipe(catchError(this.handleError.bind(this)));
  }

  public fileDownloadAsBlob(uri: string, params?: any): Observable<Blob> {
    return this.fileGet<Blob>(uri, HttpReponseType.blob, params);
  }

  public fileDownloadAsArrayBuffer(uri: string, params?: any): Observable<ArrayBuffer> {
    return this.fileGet<ArrayBuffer>(uri, HttpReponseType.arraybuffer, params);
  }

  public filePost<T>(uri: string, data: any, params?: any, responseType?: HttpReponseType): Observable<T> {
    // @ts-ignore
      return super.post<T>(this.getUrl(uri), data, this.getOptions(params, responseType)).pipe(catchError(this.handleError.bind(this)));
  }

  public filePostDownloadAsBlob(uri: string, data: any, params?: any): Observable<Blob> {
    return this.filePost<Blob>(uri, data, params, HttpReponseType.blob);
  }

  public filePostDownloadAsArrayBuffer(uri: string, data: any, params?: any): Observable<ArrayBuffer> {
    return this.filePost<ArrayBuffer>(uri, data, params, HttpReponseType.arraybuffer);
  }

  public filesUpload<T>(uri: string, files: FileList, data?: any): Observable<T> {
    // -->Create: form data
    const form = new FormData();
    let contentLength = 0;

    // -->Set: files
    if (Object.keys(files).length > 0) {
      Object.keys(files).map(f => {
        // -->Set: files
        form.append(`files`, files[f], files[f].name);
        // -->Length
        contentLength += +files[f].size;
      });

      // -->Set: data
      if (data) {
        Object.keys(data).map(k => {
          // -->Append: data
          form.append(k, data[k]);
        });
      }
      // -->Set: size
      const extraHeaders = [
        // { name: 'Content-Type', value: 'multipart/form-data' }
      ];

      // -->Set: options
      const opts = this.getOptionsForFiles(null, HttpReponseType.json);

      // @ts-ignore
        return super.post<T>(this.getUrl(uri), form, opts).pipe(catchError(this.handleError.bind(this)));
    } else {
      throw new Error(`No files sent in request`);
    }
  }

  public fileUpload<T>(uri: string, file: File, data?: any): Observable<T> {
    // -->Create: form data
    const form = new FormData();
    let contentLength = 0;

    // -->Set: files
    form.append(`file`, file, file.name);
    // -->Length
    contentLength += +file.size;
    // -->Set: data
    if (data) {
      Object.keys(data).map(k => {
        // -->Append: data
        form.append(k, data[k]);
      });
    }
    // -->Set: options
    // const opts = this.getOptionsForFiles(null, HttpReponseType.json);

    // -->Set: access token
    const accessToken = this.accessToken;
    // -->Init: headers
    let headers = new HttpHeaders();
    // -->Inject: auth headers
    headers = headers.set('X-NAO-AUTH', `${accessToken}`);
    headers = headers.set('Authorization', `Bearer ${accessToken}`);
    // -->Set: http options
    const options = {
      headers,
      reportProgress: true,
      // responseType: HttpReponseType.json,
      withCredentials: true
    };

    // -->Request
    // @ts-ignore
      return super.post<T>(this.getUrl(uri), form, options).pipe(catchError(this.handleError.bind(this)));
  }

  /**    --------------------------------
   *          Handle HTTP errors requests
   *     --------------------------------
   */

  /**
   * Handle incoming errors and then re-throw for later use
   *
   * @Upgrade:
   *    > set retry strategy for token refresh
   *    https://blog.angular-university.io/rxjs-error-handling/
   */
  public handleError(err: { error: BufferSource | undefined; }): any {
    /**
     * In some cases, the error returns as an ArrayBuffer
     *    > transform it to JSON if possible
     *    > sometimes it's just content, most times it's JSON
     */
    if (err && err.error instanceof ArrayBuffer) {
      try {
        err.error = JSON.parse(new TextDecoder().decode(err.error));
      } catch (e) {
        // skip: if it doesn't work, it doesn't work
      }
    }
    // -->Check: if the user is logged in
    // @ts-ignore
      if (err && err.error && err.error.statusCode === 401) {
      // -->Navigate: away
      // this.router.navigate(['/login'], {
      //   queryParams: { reason: 'tokenExpired' }
      // });
    }
    return throwError(err);
  }

  /**
   * Prepare request url
   */
  public getUrl(uri: string): string {
    return `${this.api.url}${uri}`;
  }

  /**
   * Get the HTTP options for the requests
   */
  private getOptions(data: any, responseType: HttpReponseType = HttpReponseType.json, requestType: HttpRequestType = HttpRequestType.json, extraHeaders: { name: string, value: string }[] = []): HttpOptions {
    // -->Get: token
    const accessToken = this.accessToken;
    // -->Init: headers
    let headers = new HttpHeaders();
    // -->Inject: auth headers
    headers = headers.set('X-NAO-AUTH', `${accessToken}`);
    // -->Set: bearer token
    headers = headers.set('Authorization', `Bearer ${accessToken}`);
    // -->Set: api header
    headers = headers.set('nao-api-key', `${this.api.naoToken}`);
    // -->Set: request header
    if (!requestType || requestType === HttpRequestType.json) {
      // don't set for other requests
      headers = headers.set('Content-Type', requestType);
    }

    if (extraHeaders && Array.isArray(extraHeaders) && extraHeaders.length > 0) {
      extraHeaders.map(h => {
        headers = headers.set(h.name, h.value);
      });
    }

    // -->Set: http options
    const options = {
      headers,
      observe: 'body',
      params: (data) ? new HttpParams({ fromObject: data }) : new HttpParams(),
      reportProgress: true,
      responseType,
      withCredentials: true
    };

    return options as HttpOptions;
  }

  /**
   * Get the HTTP options for the requests
   */
  private getOptionsForFiles(
    data: null,
    responseType: HttpReponseType = HttpReponseType.json,
    requestType: HttpRequestType = HttpRequestType.json,
    extraHeaders: { name: string, value: string }[] = []
  ): HttpOptions {
    // -->Set: access token
    const accessToken = this.accessToken;
    // -->Init: headers
    let headers = new HttpHeaders();
    // -->Inject: auth headers
    headers = headers.set('X-NAO-AUTH', `${accessToken}`);
    // -->Set: bearer token
    headers = headers.set('Authorization', `Bearer ${accessToken}`);
    // -->Set: api header
    headers = headers.set('nao-api-key', `${this.api.naoToken}`);
    // -->Add: extra headers
    if (extraHeaders && Array.isArray(extraHeaders) && extraHeaders.length > 0) {
      extraHeaders.map(h => {
        headers = headers.set(h.name, h.value);
      });
    }
    // -->Set: http options
      const options = {
      headers,
      observe: 'body',
      // @ts-ignore
      params: (data) ? new HttpParams({ fromObject: data }) : new HttpParams(),
      reportProgress: true,
      responseType,
      withCredentials: true
    };

    return options as HttpOptions;
  }
}
