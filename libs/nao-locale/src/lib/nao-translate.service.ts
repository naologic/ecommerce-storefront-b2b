import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { forIn, isPlainObject, cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class NaoTranslateService {
  constructor(
    private readonly translateService: TranslateService
  ) { }

  /**
   * Translate an object of values
   */
  public translateObject(obj: any, data?): any {
    if (isPlainObject(obj) && !!obj && Object.keys(obj).length > 0) {
      // -->Set: initial var
      const o: any = {};

      const trans = (oo) => {
        forIn (oo, (v, k) => {
          if (isPlainObject(v)) {
            // -->Translate: object
            o[k] = trans(v);
          } else if (Array.isArray(v)) {
            o[k] = v.map(vv => trans(vv));
          } else {
            // -->Translate: value
            o[k] = this.translateService.instant(v, data);
          }
        });
      };
      // -->Exec: translation
      trans(cloneDeep(obj));
      return o;
    }
    return null;
  }
}
