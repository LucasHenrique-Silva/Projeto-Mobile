import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ProductService } from './product.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-creation',
  templateUrl: './product-creation.page.html',
  styleUrls: ['./product-creation.page.scss'],
})
export class ProductCreationPage {
  productForm: FormGroup;

  customAlertOptions = {
    header: 'Type',
    subHeader: 'Select product type',
    translucent: true,
  };

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private productService: ProductService,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.productForm = this.formBuilder.group(
      {
        name: ['', Validators.required],
        quantity: ['', [Validators.required, Validators.min(1)]],
        type: ['', Validators.required],
        buy_price: ['', [Validators.required, Validators.min(0.01)]],
        sell_price: ['', [Validators.required, Validators.min(0.01)]],
        where_stored: ['', Validators.required],
      },
      { validators: this.priceValidator }
    ); // Adicione a validação personalizada aqui
  }

  // Função de validação personalizada
  priceValidator(control: AbstractControl): ValidationErrors | null {
    const buyPrice = control.get('buy_price')?.value;
    const sellPrice = control.get('sell_price')?.value;

    return sellPrice <= buyPrice ? { pricesInvalid: true } : null; // Retorna um erro se sell_price não for maior que buy_price
  }

  async saveProduct() {
    if (this.productForm.invalid) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Saving product...',
    });
    await loading.present();

    this.productService.createProduct(this.productForm.value).subscribe(
      async (response) => {
        await loading.dismiss();
        // Exibe o alerta de sucesso
        await this.showAlert('Sucesso', 'Produto criado com sucesso!');
      },
      async (error) => {
        await loading.dismiss();
        await this.showAlert('Error', 'Falha ao criar produto.');
      }
    );
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            // Redireciona para a home apenas após o clique em "OK"
            this.router.navigate(['/home']); // Substitua '/home' pela rota da sua página inicial
          },
        },
      ],
    });
    await alert.present();
  }

  isFieldInvalid(field: string): boolean {
    const control = this.productForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  // Função para verificar se o campo de venda é inválido
  isSellPriceInvalid(): boolean {
    const sellPriceControl = this.productForm.get('sell_price');
    return (
      this.productForm.hasError('pricesInvalid') &&
      sellPriceControl !== null && // Verifica se o controle existe
      sellPriceControl.touched
    );
  }
}
