import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyManagerComponent } from './currency-manager.component';
import { CommonMaterialLibModule } from 'src/app/common-material-lib/common-material-lib.module';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrencyCommunicationService } from 'src/app/services/currency-communication.service';
import { OnlyLettersDirective } from 'src/app/directives/only-letters.directive';
import { OnlyNumbersDirective } from 'src/app/directives/only-numbers.directive';



const routes: Routes = [
  {
    path: '',
    component: CurrencyManagerComponent,
    children: [
      // {
      //   path: 'your-path',
      //   component: YourComponent,
      // },
      // { path: '', redirectTo: 'accordion', pathMatch: 'full' },
      // { path: '**', redirectTo: 'accordion', pathMatch: 'full' },
    ],
  },
]; 
@NgModule({
  declarations: [
    CurrencyManagerComponent,
    OnlyLettersDirective,
    OnlyNumbersDirective
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonMaterialLibModule,
    ReactiveFormsModule
  ],
  providers: [
    CurrencyCommunicationService
  ],
  exports: [
    
  ]
})
export class CurrencyManagerModule { }
