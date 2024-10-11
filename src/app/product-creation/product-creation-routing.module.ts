import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProductCreationPage } from './product-creation.page';

const routes: Routes = [
  {
    path: '',
    component: ProductCreationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductCreationPageRoutingModule {}
