import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importa o HttpClient
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  products: any[] = [];
  employees: any[] = [];

  constructor(private router: Router, private http: HttpClient) {
    this.loadProducts(); // Carrega os produtos ao inicializar
    this.loadEmployees(); // Carrega os funcionários ao inicializar
  }

  loadProducts() {
    const url =
      'https://projeto-mobile-api.vercel.app/api/v1/products/findAll?page=1&limit=3'; // Limita a 3 produtos
    this.http.get<any>(url).subscribe(
      (response) => {
        this.products = response.data.map((product: any) => ({
          name: product.name,
          quantity: product.quantity,
          category: product.type,
          icon: this.getIconForProduct(product.type),
        }));
      },
      (error) => {
        console.error('Erro ao carregar produtos:', error);
      }
    );
  }

  loadEmployees() {
    const url =
      'https://projeto-mobile-api.vercel.app/api/v1/findAll/User?page=1&limit=3'; // Limita a 3 funcionários
    this.http.get<any[]>(url).subscribe(
      (response) => {
        console.log('Resposta da API:', response); // Para ver a estrutura
        if (Array.isArray(response)) {
          // Verifica se a resposta é um array
          this.employees = response.map((user: any) => ({
            name: user.name || 'No Name',
            position: user.role,
            email: user.email,
            icon: this.getIconForEmployee(user.role), // Certifique-se de que essa função esteja definida
          }));
        } else {
          console.error('Formato inesperado na resposta da API');
          this.employees = []; // Define employees como um array vazio se não for um array
        }
      },
      (error) => {
        console.error('Erro ao carregar funcionários:', error);
      }
    );
  }

  // Método para definir um ícone com base no tipo de produto
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

  // Método para definir um ícone com base na função (role) do funcionário
  getIconForEmployee(role: string) {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'shield-checkmark-outline'; // Ícone para administrador
      case 'caixa':
        return 'cash-outline'; // Ícone para caixa
      case 'estoque':
        return 'archive-outline'; // Ícone para estoque
      default:
        return 'person-circle-outline'; // Ícone padrão
    }
  }

  addProduct() {
    this.router.navigate(['/product-creation']); // Redireciona para a criação de produtos
  }

  goToProfile() {
    this.router.navigate(['/perfil']); // Redireciona para a página de perfil
  }

  someAction2() {
    // Remove o token e o email do armazenamento
    localStorage.removeItem('token'); // ou sessionStorage.removeItem('token');
    localStorage.removeItem('email'); // ou sessionStorage.removeItem('email');

    // Redireciona para a tela de login
    this.router.navigate(['/login']); // Substitua '/login' pela rota correta se necessário

    console.log('Ação 2 executada: usuário deslogado.');
  }
}
