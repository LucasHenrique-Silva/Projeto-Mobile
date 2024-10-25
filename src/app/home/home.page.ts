import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  products: any[] = [];
  employees: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  isInfiniteScrollDisabled: boolean = false;
  isLoading: boolean = false;
  hasMoreProducts: boolean = false; // Controle de mais produtos
  autoRefreshInterval: any; // Para armazenar o ID do intervalo de atualização

  constructor(
    private router: Router,
    private http: HttpClient,
    private loadingController: LoadingController
  ) {}

  ionViewWillEnter() {
    this.refreshData();
    this.startAutoRefresh();
  }

  ionViewWillLeave() {
    this.stopAutoRefresh();
  }

  refreshData() {
    this.currentPage = 1;
    this.products = [];
    this.loadProducts(this.currentPage);
    this.loadEmployees();
  }

  async loadProducts(page: number) {
    const url = `https://projeto-mobile-api.vercel.app/api/v1/products/findAll?page=${page}&limit=${this.itemsPerPage}`;

    this.isLoading = true;
    const loading = await this.loadingController.create({
      message: 'Atualizando lista...',
      duration: 5000,
    });
    await loading.present();

    this.http.get<{ data: any[] }>(url).subscribe(
      (response) => {
        const newProducts = response.data.map((product) => ({
          name: product.name,
          quantity: product.quantity,
          category: product.type,
          icon: this.getIconForProduct(product.type),
        }));

        this.products = [...this.products, ...newProducts];

        // Verifique se há mais produtos para carregar
        this.hasMoreProducts = newProducts.length === this.itemsPerPage;

        if (newProducts.length < this.itemsPerPage) {
          this.disableInfiniteScroll();
        }
      },
      (error) => {
        console.error('Erro ao carregar produtos:', error);
      },
      () => {
        loading.dismiss();
        this.isLoading = false;
      }
    );
  }

  loadMoreProducts() {
    this.currentPage++;
    this.loadProducts(this.currentPage);
  }

  disableInfiniteScroll() {
    const infiniteScroll = document.querySelector('ion-infinite-scroll');
    if (infiniteScroll) {
      infiniteScroll.disabled = true;
    }
  }

  loadEmployees() {
    const url =
      'https://projeto-mobile-api.vercel.app/api/v1/findAll/User?page=1&limit=3';

    this.http
      .get<{ data: any[]; total: number; page: number; lastPage: number }>(url)
      .subscribe(
        (response) => {
          if (Array.isArray(response.data)) {
            this.employees = response.data.map((user: any) => ({
              name: user.name || 'No Name',
              position: user.role,
              email: user.email,
              icon: this.getIconForEmployee(user.role),
            }));
          } else {
            console.error('Formato inesperado na resposta da API');
            this.employees = [];
          }
          console.log('API response:', response); // Para verificar se os dados estão corretos
        },
        (error) => {
          console.error('Erro ao carregar funcionários:', error);
        }
      );
  }

  getIconForProduct(type: string) {
    switch (type.toLowerCase()) {
      case 'eletronico':
        return 'phone-portrait-outline';
      case 'mobilia':
        return 'bed-outline';
      case 'vestimenta':
        return 'shirt-outline';
      case 'comida':
        return 'restaurant-outline';
      case 'outro':
        return 'cube-outline';
      default:
        return 'cube-outline';
    }
  }

  getIconForEmployee(role: string) {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'shield-checkmark-outline';
      case 'caixa':
        return 'cash-outline';
      case 'estoque':
        return 'archive-outline';
      default:
        return 'person-circle-outline';
    }
  }

  addProduct() {
    this.router.navigate(['/product-creation']);
  }

  goToProfile() {
    this.router.navigate(['/perfil']);
  }

  someAction2() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    this.router.navigate(['/login']);
    console.log('Ação 2 executada: usuário deslogado.');
  }

  startAutoRefresh() {
    this.autoRefreshInterval = setInterval(() => {
      this.refreshData();
    }, 60000); // 1 minuto
  }

  stopAutoRefresh() {
    if (this.autoRefreshInterval) {
      clearInterval(this.autoRefreshInterval);
    }
  }
}
