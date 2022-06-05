import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CurrencyManagerComponent } from '../modules/currency-manager/currency-manager.component';
import { CurrencyComponent } from '../modules/currency/currency.component';
import { RootComponent } from './root/root.component';

const routes: Routes = [
  {
    path: '',
    component: RootComponent,
    children: [
      // {
      //   path: 'YourPath',
      //   component: YourComponent
      // },
      {
        path: 'currency',
        component: CurrencyComponent
      },
      {
        path: 'currency-manager',
        component: CurrencyManagerComponent
      },
      {
        path: 'currency-manager/:currencyId',
        component: CurrencyManagerComponent
      },
      { path: '', redirectTo: 'currency', pathMatch: 'full' },
      {
        path: '**',
        redirectTo: 'error/404',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule { }
