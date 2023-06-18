import {decryptAES, encryptAES} from '../../nao-utils';
import {isPlatformBrowser} from "@angular/common";
import {PLATFORM_ID} from "@angular/core";

declare const localStorage: Storage;

export class NaoLocalStorageClass {
  get store(): Storage {
    return this.type === 'localStorage' ? localStorage : sessionStorage;
  }

  constructor(
    public readonly prefix: string = 'data',
    public readonly type: 'sessionStorage' | 'localStorage' = 'sessionStorage',
    public readonly encryption?: { type: 'aes', pass: string }
  ) {
  }

  public hasStorage(): boolean {
    if (isPlatformBrowser(PLATFORM_ID)) {
      if (this.type === 'localStorage') {
        return !!localStorage;
      }
    }
    return false;
  }

  /**
   * Get item data
   */
  public get(index: string): any {
    if (this.hasStorage()) {
      const it = this.store.getItem(`${this.prefix}.${index}`);
      if (this.encryption?.type === 'aes' && typeof it === 'string') {
        return decryptAES(it, this.encryption.pass);
      }
      return it;
    }
    return null;
  }

  /**
   * Get item data by a numeric key
   */
  public getByKey(index: number): any {
    if (typeof this.store.key(index) === 'string') {
      return this.get(this.store.key(index) as string);
    }
    return null;
  }

  /**
   * Get item data
   */
  public getObject(index: string): any {
    const data = this.get(index);
    try {
      if (typeof data === 'string') {
        return JSON.parse(data);
      }
      return data;
    } catch (err) {
      return data;
    }
  }

  /**
   * Set an item
   */
  public set(index: string, data: any): void {
    if (this.encryption?.type === 'aes') {
      data = encryptAES(data, this.encryption.pass);
    }
    return this.store.setItem(`${this.prefix}.${index}`, data);
  }

  /**
   * Set an item
   */
  public setObject(index: string, data: any): void {
    try {
      if (data) {
        data = JSON.stringify(data);
      }
      return this.set(index, data);
    } catch (err) {
      throw new Error(`Cannot stringify the data sent in setObject()`);
    }
  }

  /**
   * Get item data
   */
  public remove(index: string): void {
    return this.store.removeItem(`${this.prefix}.${index}`);
  }

  /**
   * Clear the list
   */
  public clear(): void {
    return this.store.clear();
  }
}
