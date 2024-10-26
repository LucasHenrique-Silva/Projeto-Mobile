import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.page.html',
  styleUrls: ['./editar-perfil.page.scss'],
})
export class EditarPerfilPage implements OnInit {
  name: string = '';
  email: string = '';
  dateOfBirth: string = '';
  isModalOpen: boolean = false;
  profileForm: FormGroup;
  minDate: string;
  maxDate: string;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private storage: Storage,
    private router: Router,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {
    const currentDate = new Date();
    this.minDate = new Date(
      currentDate.getFullYear() - 100,
      currentDate.getMonth(),
      currentDate.getDate()
    )
      .toISOString()
      .split('T')[0];
    this.maxDate = new Date(
      currentDate.getFullYear() - 16,
      currentDate.getMonth(),
      currentDate.getDate()
    )
      .toISOString()
      .split('T')[0];

    this.profileForm = this.formBuilder.group({
      name: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]{3,}$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required],
    });
  }

  async ngOnInit() {
    await this.initStorage();

    // Obtém o email da rota
    const email = this.route.snapshot.paramMap.get('email');
    if (email) {
      this.loadUserProfile(email);
    }
  }

  async initStorage() {
    await this.storage.create();
  }

  async loadUserProfile(email: string) {
    try {
      const response = await this.http
        .get<any>(
          `https://projeto-mobile-api.vercel.app/api/v1/findEmail/User/${email}`
        )
        .toPromise();

      if (response) {
        this.profileForm.patchValue({
          name: response.name,
          email: response.email,
          dateOfBirth: response.born_date
            ? response.born_date.split('T')[0]
            : '',
        });
        this.dateOfBirth = response.born_date
          ? response.born_date.split('T')[0]
          : '';
      }
    } catch (error) {
      console.error('Erro ao buscar os dados do usuário:', error);
    }
  }

  openDatePicker() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveDate() {
    this.dateOfBirth = this.profileForm.get('dateOfBirth')?.value;
    this.profileForm.patchValue({ dateOfBirth: this.dateOfBirth });
    this.isModalOpen = false;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.profileForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  async saveProfile() {
    // Verifica se o formulário é válido antes de prosseguir
    if (this.profileForm.invalid) {
      return;
    }

    try {
      // Obtém o token do storage e o email do formulário
      const token = await this.storage.get('token');
      const email = this.profileForm.get('email')?.value;

      // Configura a URL e os headers para a requisição
      const url = `https://projeto-mobile-api.vercel.app/api/v1/update/user/${email}`;
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      // Cria o objeto com os dados do usuário para atualização
      const userData = {
        name: this.profileForm.get('name')?.value,
        born_date: this.profileForm.get('dateOfBirth')?.value,
      };

      // Realiza a requisição PUT para atualizar os dados do usuário
      await this.http.put(url, userData, { headers }).toPromise();

      // Exibe o alerta de sucesso e navega para a página inicial
      const successAlert = await this.alertController.create({
        header: 'Sucesso',
        message: 'Perfil atualizado com sucesso!',
        buttons: [
          {
            text: 'OK',
            handler: () => {
              this.router.navigate(['/home']); // Redireciona para a página inicial
            },
          },
        ],
      });
      await successAlert.present();
    } catch (error) {
      // Tratamento de erros com logging e alerta para o usuário
      console.error('Erro ao atualizar o perfil:', error);
      const errorAlert = await this.alertController.create({
        header: 'Erro',
        message:
          'Ocorreu um erro ao atualizar o perfil. Verifique sua conexão e tente novamente.',
        buttons: ['OK'],
      });
      await errorAlert.present();
    }
  }
}
