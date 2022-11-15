import { Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { NaoHttp2ApiService } from '@naologic/nao-http2';
import { NaoDocumentInterface } from "@naologic/nao-interfaces";
import { NaoUserAccessService } from "@naologic/nao-user-access";

@Injectable({
    providedIn: 'root'
})
export class ECommerceService<T = any> {
    private get apiRoot(): string { return this.naoUsersService.isLoggedIn() ? 'universal' : 'universal-public'; }

    public readonly subs = new Subscription();

    constructor(
        private readonly naoHttp2ApiService: NaoHttp2ApiService,
        private readonly naoUsersService: NaoUserAccessService,
    ) { }

    /**
     * Get: info that contains categories, vendors, FAQ and stuff like that
     *
     * NEW: http://localhost:3010/api/v2/universal/ecommerce/data/get-ecommerce-config-document
     */
    public getInfo(data?: any, naoQueryOptions = { docName: 'shop', cfpPath: 'ecommerce/ecommerce' }): Observable<T> {
        return this.naoHttp2ApiService.postJson<T>(`${this.apiRoot}/ecommerce/data/get-public-store-information`, { data: { data: { m: 12 }, naoQueryOptions } });
    }

    /**
     * Get: products filter data
     */
    public productsFilter(data?: any, naoQueryOptions = { docName: 'shop', cfpPath: 'ecommerce/ecommerce' }): Observable<T> {
        return this.naoHttp2ApiService.postJson<T>(`${this.apiRoot}/ecommerce/data/search-public-store-products`, { data: { data, naoQueryOptions } });
    }

    /**
     * Get: single document by Id
     */
    public productsGet(docId: string, naoQueryOptions = { docName: 'shop', cfpPath: 'ecommerce/ecommerce' }): Observable<T> {
        return this.naoHttp2ApiService.postJson<T>(`${this.apiRoot}/ecommerce/data/get-public-product-information`, { data: { data: { docId }, naoQueryOptions } });
    }












    /**
     * Get: multiple documents by Id
     */
    public productsGetBulk(docIds: string[], naoQueryOptions = NaoDocumentInterface.naoQueryOptionsDefault()): Observable<T> {
        return this.naoHttp2ApiService.postJson<T>(`${this.apiRoot}/products/get/${naoQueryOptions.docName}/bulk`, { data: { docIds }, naoQueryOptions });
    }

    /**
     * Get: products data with filter
     */
    public productsList(data, naoQueryOptions = NaoDocumentInterface.naoQueryOptionsDefault()): Observable<T> {
        return this.naoHttp2ApiService.postJson<T>(`${this.apiRoot}/products/list/${naoQueryOptions.docName}/filter`, { data, naoQueryOptions });
    }

    /**
     * Get: invoices with pagination
     */
    public listInvoices(data?, naoQueryOptions = NaoDocumentInterface.naoQueryOptionsDefault()): Observable<T> {
        return this.naoHttp2ApiService.postJson<T>(`${this.apiRoot}/invoices/list/${naoQueryOptions.docName}/filter`, { data, naoQueryOptions });
    }

    /**
     *  Verify: if a checkout can be made with the current cart items
     */
    public verifyCheckout(data: T, naoQueryOptions = NaoDocumentInterface.naoQueryOptionsDefault({ userMode: 'guest-external' })): Observable<T> {
        return this.naoHttp2ApiService.postJson<T>(`${this.apiRoot}/checkout/verify/${naoQueryOptions.docName}/order`, { data: { data }, naoQueryOptions });
    }

    /**
     *  Execute: a checkout
     */
    public completeCheckout(data: T, naoQueryOptions = NaoDocumentInterface.naoQueryOptionsDefault({ userMode: 'guest-external' })): Observable<T> {
        return this.naoHttp2ApiService.postJson<T>(`${this.apiRoot}/checkout/checkout/${naoQueryOptions.docName}/order`, { data: { data }, naoQueryOptions });
    }
}
