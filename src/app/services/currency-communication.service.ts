import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrencyCommunicationService {

  private selectedCurrency = new ReplaySubject<any>(1);
  currentSelectedCurrency$ = this.selectedCurrency.asObservable();

  constructor() { }

  emitselectedCurrency(currency) {
    this.selectedCurrency.next(currency);
  }
}
