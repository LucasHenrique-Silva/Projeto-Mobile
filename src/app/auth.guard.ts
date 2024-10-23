import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private storage: Storage) {}

  async canActivate(): Promise<boolean> {
    await this.storage.create(); // Certifique-se de que o armazenamento está inicializado
    const token = await this.storage.get('token'); // Obtenha o token armazenado

    if (token) {
      return true; // Se o token existe, permite acesso
    } else {
      this.router.navigate(['login']); // Caso contrário, redireciona para a página de login
      return false; // Impede o acesso à rota
    }
  }
}
