import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NaoLocaleService {
  constructor(
    @Inject('localeData') private readonly localeData,
  ) { }
}
