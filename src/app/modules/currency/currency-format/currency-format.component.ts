import {
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output
  } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyCommunicationService } from 'src/app/services/currency-communication.service';
import { CurrencyApiService } from 'src/app/services/currency.service';

  import { Currency } from './currency-format.typings';


  @Component({
    selector: 'currency-format',
    templateUrl: './currency-format.component.html',
    styleUrls: ['./currency-format.component.scss'],
  })
  export class CurrencyFormat implements OnInit {
  
    // {
    //     "_id": "61227d5453e7b5000940263e",
    //     "countryCode": "US",
    //     "languageIsoCode": "es",
    //     "currencyCode": "MXN",
    //     "format": {
    //         "useCode": true,
    //         "cents": 2,
    //         "currencyPosition": "BEFORE",
    //         "thousandIdentifier": ",",
    //         "decimalSeparator": "."
    //     },
    //     "createdAt": "2021-08-22T16:37:40.948Z"
    // }
    @Input() currency: Currency;
    @Output() sendDeletedCurrency: EventEmitter<any> = new EventEmitter();

    constructor(
      private router: Router,
      private currencyService: CurrencyApiService,
      private currencyCommunicationService: CurrencyCommunicationService
    ) {}
  
    
    
    ngOnInit(): void {
     
    }

    updateCurrency(currency:Currency){
      this.currencyCommunicationService.emitselectedCurrency(currency);
      this.router.navigate(['/currency-manager'],{ queryParams: { currencyId: currency._id } });
    }

    async deleteCurrency(currency:Currency){
      try {
        await this.currencyService.deleteCurrencyById(currency._id);
        this.sendDeletedCurrency.emit(true);
      } catch (error) {
        
      }
    }
  }
  