import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-employee-accounts',
  templateUrl: './employee-accounts.page.html',
  styleUrls: ['./employee-accounts.page.scss'],
})
export class EmployeeAccountsPage implements OnInit {
  employees: any[] = []; // Inicialize como um array vazio
  loggedInUserRole: string | null = null; // Armazenar o role do usuário logado

  constructor(
    private router: Router,
    private http: HttpClient,
    private storage: Storage
  ) {}

  ionViewWillEnter() {
    this.getLoggedInUserRole();
    this.loadEmployees();
  }

  ngOnInit() {
    this.loadEmployees(); // Carrega os funcionários ao inicializar o componente
  }

  async getLoggedInUserRole() {
    this.loggedInUserRole = await this.storage.get('userRole');
  }

  goToEditProfile(email: string) {
    this.router.navigate(['/editar-perfil', email]);
  }

  loadEmployees() {
    const url =
      'https://projeto-mobile-api.vercel.app/api/v1/findAll/User?page=1&limit=100';

    this.http
      .get<{ data: any[]; total: number; page: number; lastPage: number }>(url)
      .subscribe(
        (response) => {
          if (Array.isArray(response.data)) {
            this.employees = response.data.map((user: any) => ({
              name: user.name || 'No Name',
              position: user.role,
              email: user.email, // O email ainda é carregado, mas será exibido apenas para admin
              icon: this.getIconForEmployee(user.role),
            }));
          } else {
            console.error('Formato inesperado na resposta da API');
            this.employees = [];
          }
        },
        (error) => {
          console.error('Erro ao carregar funcionários:', error);
        }
      );
  }

  goToProfile(employee: any) {
    this.router.navigate(['/perfil'], {
      queryParams: { name: employee.name, email: employee.email },
    });
  }

  getIconForEmployee(role: string): string {
    // Aqui você pode mapear os papéis para ícones específicos
    switch (role) {
      case 'admin':
        return 'person-circle-outline';
      case 'caixa':
        return 'cash-outline';
      case 'estoque':
        return 'clipboard-outline';
      default:
        return 'person-outline';
    }
  }

  goToYourProfile() {
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

  goToCadaster() {
    this.router.navigate(['/cadastro']);
  }
}
