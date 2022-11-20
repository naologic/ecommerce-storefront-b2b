import { BehaviorSubject, Subscription } from 'rxjs';
import { debounce, merge } from 'lodash';
import { NaoDataInterface } from "@naologic/nao-utils";

const defaultData = {
  sub$: new Subscription(),
  loading: false,
  deb: null,
  data: {},
  searchFields: [],
  selectField: "",
  value: null,
};

export class NaoFetchClass implements NaoDataInterface.SelectFetcher {
  public subFetch: { [index: string]: NaoFetchClass } = {};
  public subs = new Subscription();
  public sub$ = new Subscription();
  public loading!: boolean;
  public deb!: any;
  public data: { [key: string]: any[] } = {};
  public value!: any;
  public subSelectData?: any[];

  /**
   * Behavior subject for data change
   */
  public data$: BehaviorSubject<{ [key: string]: any[] } | null> = new BehaviorSubject<{ [p: string]: any[] } | null>(null);


  constructor(
    public readonly initData?: Partial<NaoDataInterface.SelectFetchers>,
  ) {
    // -->Set: fetch init
    // this.fetch = merge(defaultData, this.initData || {});
    // -->Set: my own status
  }

  /**
   * Get a sub-status
   */
  public f(name: string, initData?: Partial<NaoDataInterface.SelectFetchers>): NaoFetchClass {
    if (!(this.subFetch[name] instanceof NaoFetchClass)) {
      this.subFetch[name] = new NaoFetchClass(initData);
    }
    return this.subFetch[name];
  }

  /**
   * Clone data from init
   */
  public cloneDataInit(): NaoDataInterface.SelectFetcher {
    return merge(defaultData, this.initData || {});
  }

  /**
   * Set a debounce function
   */
  public setDebounce(cb: any, timeout: number = 500, options = { leading: false, maxWait: 0, trailing: true }): void {
    this.deb = debounce(cb, timeout, options);
  }

  /**
   * Execute debounce function
   */
  public execDebounce(): void {
    // -->Start: debouncer
    this.deb();
  }

  /**
   * Cancel the debouncer
   */
  public cancelDebounce(): void {
    if (this.deb) {
      this.deb.cancel();
      this.sub$.unsubscribe();
    }
  }

  /**
   * Set data
   */
  public setData(data: any, dataType: string = "data"): void {
    this.data[dataType] = data;
    // -->Update: Behavior subject
    this.data$.next(this.data);
  }


  /**
   * Get: data
   */
  public getData(dataType: string = "data"): any[] {
    return this.data[dataType] || [];
  }

  /**
   * Get: data
   */
  public getDataAsObject(dataType: string = "data"): any {
    return this.data[dataType] || {};
  }


  /**
   * Reset the value
   */
  public reset(): void {
    this.value = null;
  }

  public hasDebounce(): boolean {
    return !!this.deb;
  }

  public onDestroy(): void {
    this.data = {};
    this.data$.next(null);
    this.subs.unsubscribe();
  }
}
