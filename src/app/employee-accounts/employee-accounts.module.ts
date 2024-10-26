import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EmployeeAccountsPageRoutingModule } from './employee-accounts-routing.module';

import { EmployeeAccountsPage } from './employee-accounts.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EmployeeAccountsPageRoutingModule
  ],
  declarations: [EmployeeAccountsPage]
})
export class EmployeeAccountsPageModule {}
