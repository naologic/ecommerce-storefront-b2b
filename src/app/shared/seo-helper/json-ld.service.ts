import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class JsonLdService {
  private jsonLd: any[] = [];
  public jsonLdPrint: string[] = [];

  /**
   * Set json+ld data
   */
  public setRawData(...jsonLd: any[]) {
    // -->Set: json LD
    this.jsonLd = jsonLd as any[];
    // -->Check: array
    if (Array.isArray(this.jsonLd) && this.jsonLd.length) {
      // -->Set: print
      this.jsonLdPrint = this.jsonLd.map(json => {
        if (json) {
          return JSON.stringify(json);
        }
        return json;
      });
    }
  }

  public toJsonArray() {
    return this.jsonLdPrint;
  }
}
