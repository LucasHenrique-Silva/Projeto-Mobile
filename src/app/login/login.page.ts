import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { AuthResponse } from './auth-response.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private router: Router,
    private storage: Storage,
    private http: HttpClient
  ) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create(); // Inicializa o armazenamento
  }

  async login() {
    try {
      const response = await this.http
        .post<AuthResponse>(
          'https://projeto-mobile-api.vercel.app/api/v1/auth/user',
          {
            email: this.email,
            password: this.password,
          }
        )
        .toPromise();

      if (response && response.token) {
        // Verifica se a propriedade userExists existe
        if (response.userExists && response.userExists.email) {
          await this.storage.set('token', response.token);
          await this.storage.set('email', response.userExists.email);
          await this.storage.set('userRole', response.userExists.role);

          this.router.navigate(['/home']);
        } else {
        }
      } else {
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  }
}
