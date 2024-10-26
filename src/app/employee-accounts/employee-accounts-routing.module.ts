import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EmployeeAccountsPage } from './employee-accounts.page';

const routes: Routes = [
  {
    path: '',
    component: EmployeeAccountsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeeAccountsPageRoutingModule {}
