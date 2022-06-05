import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CurrencyApiService } from 'src/app/services/currency.service';
import { Currency } from './currency-format/currency-format.typings';

interface Response {
  total: number;
  result: Currency[];
}

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit {

  currencies: Currency[] = [];
  isLoading: boolean;

  constructor(private currencyService: CurrencyApiService, private ref: ChangeDetectorRef) {

  }

  ngOnInit(): void {
    this.getCurrenciesList();
  }

  getCurrenciesList() {
    this.isLoading = true;
    this.currencyService.getCurrencies().then((response: Response) => {
      this.currencies = response.result;

      this.isLoading = false;
      this.ref.detectChanges();
    })
      .catch((err) => {
        console.log('err ', err);
        this.isLoading = false;
      })
  }

}
