import {
    Component,
    Input,
    OnInit,
    SimpleChanges,
    OnChanges
  } from '@angular/core';
import { CURRENCY_POSITION, SEPARATOR_AND_IDENTIFIER } from 'src/app/format-configs/format.configs';
  
  import { Currency, CurrencyFormat } from '../currency-format/currency-format.typings';
  @Component({
    selector: 'price-preview',
    templateUrl: './price-preview.component.html',
    styleUrls: [],
  })
  export class PricePreview implements OnInit, OnChanges {

    // {
    //     "format": {
    //         "useCode": true,
    //         "cents": 2,
    //         "currencyPosition": "BEFORE",
    //         "thousandIdentifier": ",",
    //         "decimalSeparator": "."
    //     }
    // }
    priceFormat: string = "1.234";
    currencySymbol: string = "$"; // Set '$' as default since in registration page, code inputs are open to user typo errors
    showValue:number = 1234;

    @Input() format: CurrencyFormat;
    @Input() currencyData: Currency;
    constructor() { }
  

    
    ngOnInit(): void {
      this.priceFormat = this.showValue.toLocaleString(this.format.thousandIdentifier === SEPARATOR_AND_IDENTIFIER.COMMA.value
        ? 'en'
        : 'de',{
        minimumFractionDigits:this.format.cents,
        maximumFractionDigits:this.format.cents,
      });
      this.currencySymbol = this.format.useCode ? this.currencyData.currencyCode : this.currencySymbol;
      if(this.format.currencyPosition === CURRENCY_POSITION.BEFORE.value){
        this.priceFormat = this.currencySymbol + ' ' + this.priceFormat;
      }else{
        this.priceFormat = this.priceFormat + ' ' + this.currencySymbol
      }
    }
  
    ngOnChanges(changes: SimpleChanges): void {

    }
  }
  