import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ProductService } from './product.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-creation',
  templateUrl: './product-edit.page.html',
  styleUrls: ['./product-edit.page.scss'],
})
export class ProductCreationPage implements OnInit {
  productForm: FormGroup;
  productId: string | null = null;

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
    private loadingController: LoadingController,
    private route: ActivatedRoute
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
    );
  }

  ngOnInit() {
    this.productId = this.route.snapshot.paramMap.get('id');
    if (this.productId) {
      this.loadProductData(this.productId); // Carrega os dados do produto
    }
  }

  // Carrega os dados do produto pelo ID e preenche o formulário
  async loadProductData(id: string) {
    const loading = await this.loadingController.create({
      message: 'Carregando produto...',
    });
    await loading.present();

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.productForm.patchValue({
          name: product.product.name,
          quantity: product.product.quantity,
          type: product.product.type,
          buy_price: product.product.buy_price,
          sell_price: product.product.sell_price,
          where_stored: product.product.where_stored,
        });
        loading.dismiss();
      },
      error: async () => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: 'Erro',
          message: 'Falha ao carregar o produto.',
          buttons: ['OK'],
        });
        await alert.present();
      },
    });
  }

  // Função de validação personalizada para garantir que sell_price > buy_price
  priceValidator(control: AbstractControl): ValidationErrors | null {
    const buyPrice = control.get('buy_price')?.value;
    const sellPrice = control.get('sell_price')?.value;

    return sellPrice <= buyPrice ? { pricesInvalid: true } : null;
  }

  async saveProduct() {
    if (this.productForm.invalid) {
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Salvando produto...',
    });
    await loading.present();

    const productData = this.productForm.value;

    if (this.productId) {
      // Atualiza o produto existente
      this.productService.updateProduct(this.productId, productData).subscribe({
        next: async () => {
          loading.dismiss();
          await this.showAlert('Sucesso', 'Produto atualizado com sucesso.');
        },
        error: async () => {
          loading.dismiss();
          const alert = await this.alertController.create({
            header: 'Erro',
            message: 'Falha ao atualizar o produto.',
            buttons: ['OK'],
          });
          await alert.present();
        },
      });
    } else {
      loading.dismiss();
      const alert = await this.alertController.create({
        header: 'Erro',
        message: 'Produto não encontrado.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            this.router.navigate(['/home']); // Substitua '/home' pela rota de sua página inicial
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

  isSellPriceInvalid(): boolean {
    const sellPriceControl = this.productForm.get('sell_price');
    return (
      this.productForm.hasError('pricesInvalid') &&
      sellPriceControl !== null &&
      sellPriceControl.touched
    );
  }
}
