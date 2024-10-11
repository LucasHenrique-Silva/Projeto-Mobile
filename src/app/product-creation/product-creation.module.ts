import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductCreationPageRoutingModule } from './product-creation-routing.module';

import { ProductCreationPage } from './product-creation.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductCreationPageRoutingModule
  ],
  declarations: [ProductCreationPage]
})
export class ProductCreationPageModule {}
