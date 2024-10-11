import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-product-creation',
  templateUrl: './product-creation.page.html',
  styleUrls: ['./product-creation.page.scss'],
})
export class ProductCreationPage {
  product = {
    name: '',
    quantity: '',
    type: '',
    purchasePrice: '',
    salePrice: '',
    location: '',
  };

  constructor(private alertController: AlertController) {}

  saveProduct() {
    // Exemplo de lógica para salvar o produto
    console.log(this.product);

    this.showAlert('Success', 'Product saved successfully!');
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
