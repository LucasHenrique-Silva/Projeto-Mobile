import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // Importe o ReactiveFormsModule
import { IonicModule } from '@ionic/angular';
import { ProductCreationPageRoutingModule } from './product-edit-routing.module';
import { ProductCreationPage } from './product-edit.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, // Adicione ReactiveFormsModule
    IonicModule,
    ProductCreationPageRoutingModule,
  ],
  declarations: [ProductCreationPage],
})
export class ProductCreationPageModule {}
