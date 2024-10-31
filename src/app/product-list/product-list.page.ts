import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnDestroy, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { interval, Subscription } from 'rxjs';

interface Product {
  id: string;
  name: string;
  quantity: number;
  price: number;
  type: string;
  buy_price: number;
  sell_price: number;
  where_stored: string;
}

@Component({
  selector: 'app-product-list',
  templateUrl: 'product-list.page.html',
  styleUrls: ['product-list.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductListPage implements OnDestroy {
  isSearchOpen = false;
  searchQuery: string = '';
  selectedFilter: string = 'name';
  selectedCategory: string = 'all';
  sortOrder: string = 'asc';
  products: Product[] = [];
  filteredProducts: Product[] = [];
  page = 1;
  limit = 10;
  expandedProduct: Product | null = null;
  updateSubscription: Subscription | undefined;
  hasMoreProducts: boolean = true;

  constructor(
    private router: Router,
    private http: HttpClient,
    private loadingCtrl: LoadingController
  ) {}

  async ionViewWillEnter() {
    await this.loadProducts(); // Carrega os produtos ao entrar na página
    this.setupAutoUpdate(); // Configura a atualização a cada 2 minutos
  }

  ngOnDestroy() {
    // Cancela o intervalo de atualização ao sair da página
    if (this.updateSubscription) {
      this.updateSubscription.unsubscribe();
    }
  }

  openSearch() {
    this.isSearchOpen = !this.isSearchOpen;
  }

  selectFilter(filter: string) {
    if (this.selectedFilter === filter) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.selectedFilter = filter;
      this.sortOrder = 'asc';
    }
    this.page = 1; // Reset page when filter changes
    this.loadProducts(); // Reload products with new filter
  }

  async loadProducts() {
    const loading = await this.loadingCtrl.create({
      message: 'Carregando...',
    });
    await loading.present();

    const params = new HttpParams()
      .set('page', this.page.toString())
      .set('limit', this.limit.toString())
      .set('sortBy', this.selectedFilter)
      .set('order', this.sortOrder)
      .set(
        'type',
        this.selectedCategory === 'all' ? '' : this.selectedCategory
      );

    this.http
      .get<{ data: Product[]; total: number; page: number; lastPage: number }>(
        'https://projeto-mobile-api.vercel.app/api/v1/products/findAllFilter',
        { params }
      )

      .subscribe(
        (response) => {
          if (this.page === 1) {
            this.products = response.data; // Reset products on first page load
            if (response.data.length < this.limit) {
              this.disableInfiniteScroll();
            }
          } else {
            this.products = [...this.products, ...response.data]; // Append new products
            if (response.data.length < this.limit) {
              this.disableInfiniteScroll();
            }
          }
          console.log(response.data.length);
          console.log(this.hasMoreProducts);

          if (response.data.length < this.limit) {
            console.log(this.hasMoreProducts);
            this.disableInfiniteScroll();
          } else {
            this.hasMoreProducts = true;
          }
          this.filteredProducts = this.products;
          loading.dismiss();
        },
        (error) => {
          console.error('Erro ao carregar produtos:', error);
          loading.dismiss();
        }
      );
  }

  loadMoreProducts() {
    this.page++; // Incrementa a página para a próxima carga
    this.loadProducts(); // Carrega mais produtos
  }

  filterProducts() {
    this.filteredProducts = this.products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase());
      const matchesCategory =
        this.selectedCategory === 'all' ||
        product.type === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  setupAutoUpdate() {
    // Configura a atualização automática a cada 5 minutos (300000 ms)
    this.updateSubscription = interval(300000).subscribe(() => {
      this.loadProducts();
    });
  }

  getIcon(type: string): string {
    switch (type) {
      case 'eletronico':
        return 'laptop-outline';
      case 'vestimenta':
        return 'shirt-outline';
      case 'comida':
        return 'nutrition-outline';
      case 'mobilia':
        return 'bed-outline';
      default:
        return 'cube-outline';
    }
  }

  addProduct() {
    this.router.navigate(['/product-creation']);
  }

  editProduct(product: Product) {
    console.log('Edit Product:', product);
  }

  deleteProduct(product: Product) {
    const productId = product.id;
    this.http
      .delete(
        `https://projeto-mobile-api.vercel.app/api/v1/delete/stock/id/${productId}`
      )
      .subscribe(
        () => {
          this.products = this.products.filter((p) => p.id !== productId);
          this.filterProducts();
        },
        (error) => {
          console.error('Erro ao deletar o produto:', error);
        }
      );
  }

  goToProfile() {
    this.router.navigate(['/perfil']);
  }

  goToHome() {
    this.router.navigate(['/home']);
  }

  goToProducts() {
    this.router.navigate(['/product-list']);
  }

  goToEmployees() {
    this.router.navigate(['/employee-accounts']);
  }

  toggleProduct(product: Product) {
    this.expandedProduct = this.expandedProduct === product ? null : product;
  }

  disableInfiniteScroll() {
    this.hasMoreProducts = false;
  }
}
