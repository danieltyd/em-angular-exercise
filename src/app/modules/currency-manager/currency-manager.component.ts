import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CurrencyCommunicationService } from 'src/app/services/currency-communication.service';
import { CurrencyApiService } from 'src/app/services/currency.service';
import { isThisTypeNode } from 'typescript';
import { CURRENCY_POSITION, SEPARATOR_AND_IDENTIFIER } from '../../format-configs/format.configs';
import { Currency } from '../currency/currency-format/currency-format.typings';

@Component({
  selector: 'app-currency-manager',
  templateUrl: './currency-manager.component.html',
  styleUrls: ['./currency-manager.component.scss']
})
export class CurrencyManagerComponent implements OnInit, OnDestroy {
  alertSuccess=document.getElementById('alertSuccess');
  alertDanger= document.getElementById('alertDanger');

  public currencyForm: FormGroup;
  public formatForm: FormGroup;
  public isNewCourrency: boolean = true;
  public currencyPosition = CURRENCY_POSITION;
  public separatorAndIdentifier = SEPARATOR_AND_IDENTIFIER;
  private currencySelectedSubscriber: Subscription;
  private currencySelected: Currency;
  public isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private builder: FormBuilder,
    private currencyService: CurrencyApiService,
    private currencyCommunicationService: CurrencyCommunicationService,
    private ref: ChangeDetectorRef,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.initCurrencyForm();
    this.initFormatForm();
    // An option if there was an endpoint to get a courrency data by Id
    /* this.route.queryParams.subscribe(params => {
      console.log(params);
      if (params && params.currencyId) {
        this.isNewCourrency = false;
      }
    }); */
    this.currencySelectedSubscriber = this.currencyCommunicationService.currentSelectedCurrency$.subscribe((currency: Currency) => {
      if (!currency) { return; }
      this.isNewCourrency = false;
      this.initFormData(currency);
    });
  }

  initFormData(currency: Currency) {
    this.currencySelected = currency;
    this.currencyForm.get('countryCode').setValue(currency.countryCode);
    this.currencyForm.get('currencyCode').setValue(currency.currencyCode);
    this.currencyForm.get('languageIsoCode').setValue(currency.languageIsoCode);
    this.formatForm.setValue(currency.format);
  }

  ngOnDestroy(): void {
    if (this.currencySelectedSubscriber) {
      this.currencySelectedSubscriber.unsubscribe();
      this.currencyCommunicationService.emitselectedCurrency(null);
    }
  }

  private initCurrencyForm() {
    this.currencyForm = this.builder.group({
      countryCode: [null, [Validators.required, Validators.maxLength(3)]],
      currencyCode: [null, [Validators.required, Validators.maxLength(3)]],
      languageIsoCode: [null, [Validators.required, Validators.maxLength(3)]]
    })
  }

  private initFormatForm() {
    this.formatForm = this.builder.group({
      useCode: [true, Validators.required],
      cents: [0, [Validators.required, Validators.min(0), Validators.max(9)]],
      currencyPosition: [this.currencyPosition.BEFORE.value, Validators.required],
      thousandIdentifier: [this.separatorAndIdentifier.COMMA.value, Validators.required],
      decimalSeparator: [this.separatorAndIdentifier.PERIOD.value, Validators.required]
    });
    this.formatForm.get('thousandIdentifier').valueChanges.subscribe(result => {
      const thousandIdentifier = this.formatForm.get('thousandIdentifier').value;
      if (thousandIdentifier === this.separatorAndIdentifier.COMMA.value) {
        this.formatForm.get('decimalSeparator').setValue(this.separatorAndIdentifier.PERIOD.value, { emitEvent: false });
      }
      if (thousandIdentifier === this.separatorAndIdentifier.PERIOD.value) {
        this.formatForm.get('decimalSeparator').setValue(this.separatorAndIdentifier.COMMA.value, { emitEvent: false });
      }
    });
    this.formatForm.get('decimalSeparator').valueChanges.subscribe(result => {
      const thousandIdentifier = this.formatForm.get('decimalSeparator').value;
      if (thousandIdentifier === this.separatorAndIdentifier.COMMA.value) {
        this.formatForm.get('thousandIdentifier').setValue(this.separatorAndIdentifier.PERIOD.value, { emitEvent: false });
      }
      if (thousandIdentifier === this.separatorAndIdentifier.PERIOD.value) {
        this.formatForm.get('thousandIdentifier').setValue(this.separatorAndIdentifier.COMMA.value, { emitEvent: false });
      }
    });
  }

  async saveCurrency() {
    let currencyObj = { ...this.currencyForm.value };
    currencyObj.format = { ...this.formatForm.value };
    if (this.isNewCourrency) {
      try {
        this.isLoading = true;
        await this.currencyService.saveNewCurrency(currencyObj);
        this.isLoading = false;
        this.showSuccessAlert();
      } catch (error) {
        alert('Error');
        this.isLoading = false;
        this.showErrorAlert();
      }
    } else {
      try {
        currencyObj._id = this.currencySelected._id;
        currencyObj.createdAt = new Date();
        this.isLoading = true;
        await this.currencyService.updateCurrencyData(this.currencySelected._id, currencyObj);
        this.isLoading = false;
        this.showSuccessAlert();
      } catch (error) {
        alert('Error');
        this.isLoading = false;
        this.showErrorAlert();
      }
    }
    this.ref.detectChanges();
  }

  showErrorAlert(){
    this.alertDanger.classList.remove('d-none');
    this.alertDanger.classList.add('show');
    setTimeout(() => {
      this.closeAlert();
    }, 5000);
  }

  showSuccessAlert(){
    this.alertSuccess.classList.remove('d-none');
    this.alertSuccess.classList.add('show');
    this.router.navigate(['/currency'] );
    setTimeout(() => {
      this.closeAlert();
    }, 5000);
  }
  closeAlert(){
    this.alertSuccess.classList.remove('show');
    this.alertSuccess.classList.add('d-none');

    this.alertDanger.classList.remove('show');
    this.alertDanger.classList.add('d-none');
  }
// Necessary if request body needs only changed parameters, Not needed in this case
  /* async saveCurrency() {
    let currencyObj = { ...this.currencyForm.value };
    currencyObj.format = { ...this.formatForm.value };
    if (this.isNewCourrency) {
      try {
        this.isLoading = true;
        await this.currencyService.saveNewCurrency(currencyObj);
        this.isLoading = false;
        this.showSuccessAlert();
      } catch (error) {
        alert('Error');
        this.isLoading = false;
        this.showErrorAlert();
      }
    } else {
      // Necessary if request body needs only changed parameters, Not needed in this case
      const valuesCurrency = this.getDirtyValues(this.currencyForm);
      const valuesFormat = this.getDirtyValues(this.formatForm);
      currencyObj = { ...valuesCurrency };
      if (!this.isEmpty(valuesFormat)) {
        currencyObj.format = { ...valuesFormat };
      }
      try {
        this.isLoading = true;
        await this.currencyService.updateCurrencyData(this.currencySelected._id, currencyObj);
        this.isLoading = false;
        this.showSuccessAlert();
      } catch (error) {
        alert('Error');
        this.isLoading = false;
        this.showErrorAlert();
      }
    }
    this.ref.detectChanges();
  }
  getDirtyValues(form: any) {
    let dirtyValues = {};

    Object.keys(form.controls)
      .forEach(key => {
        let currentControl = form.controls[key];
        if (currentControl.dirty) {
          if (currentControl.controls)
            dirtyValues[key] = this.getDirtyValues(currentControl);
          else
            dirtyValues[key] = currentControl.value;
        }
      });

    return dirtyValues;
  }

  isEmpty(object) {
    for (const property in object) {
      return false;
    }
    return true;
  } */

}
