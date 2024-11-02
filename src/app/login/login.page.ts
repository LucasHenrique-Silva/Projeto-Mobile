import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { AlertController, LoadingController } from '@ionic/angular';
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
    private http: HttpClient,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create(); // Inicializa o armazenamento
  }

  async login() {
    const loading = await this.loadingController.create({
      message: 'Logando...',
      spinner: 'crescent',
    });
    await loading.present();

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
        if (response.userExists && response.userExists.email) {
          await this.storage.set('token', response.token);
          await this.storage.set('email', response.userExists.email);
          await this.storage.set('userRole', response.userExists.role);
          this.router.navigate(['/home']);
        } else {
          await this.showAlert('Falha', 'Usuário não encontrado.');
        }
      } else {
        await this.showAlert(
          'Erro',
          'Falha ao logar. Verifique suas credenciais.'
        );
      }
    } catch (error) {
      await this.showAlert(
        'Erro',
        'Falha ao logar. Verifique suas credenciais.'
      );
      console.error('Erro ao fazer login:', error);
    } finally {
      loading.dismiss();
    }
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
