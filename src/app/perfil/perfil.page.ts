import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  name: string = '';
  email: string = '';
  dateOfBirth: string = '';
  isModalOpen: boolean = false;
  profileForm: FormGroup;
  minDate: string; // Adicione estas linhas
  maxDate: string; // Adicione estas linhas

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private storage: Storage,
    private http: HttpClient
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

    this.initStorage();
    this.profileForm = this.formBuilder.group({
      name: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]{3,}$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required], // A data de nascimento é obrigatória
    });
  }

  async initStorage() {
    await this.storage.create(); // Inicializa o armazenamento
    this.loadUserProfile();
  }

  async loadUserProfile() {
    const storedEmail = await this.storage.get('email');
    if (storedEmail) {
      try {
        const response = await this.http
          .get<any>(
            `https://projeto-mobile-api.vercel.app/api/v1/findEmail/User/${storedEmail}`
          )
          .toPromise();

        if (response) {
          // Preencher o formulário com os dados do usuário
          this.profileForm.patchValue({
            name: response.name,
            email: response.email,
            dateOfBirth: response.born_date
              ? response.born_date.split('T')[0]
              : '', // Converte para ISO
          });

          // Atualiza a variável de data de nascimento para o valor do formulário
          this.dateOfBirth = response.born_date
            ? response.born_date.split('T')[0]
            : '';
        }
      } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error);
      }
    }
  }

  async saveProfile() {
    if (this.profileForm.invalid) {
      return;
    }
    // Adicione aqui a lógica para salvar o perfil
    console.log('Perfil salvo:', this.profileForm.value);
  }

  openDatePicker() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveDate() {
    this.dateOfBirth = this.profileForm.get('dateOfBirth')?.value; // Pega o valor da data diretamente do formulário
    this.profileForm.patchValue({ dateOfBirth: this.dateOfBirth }); // Atualiza o formulário com a nova data
    this.isModalOpen = false; // Fecha o modal
  }

  isFieldInvalid(field: string): boolean {
    const control = this.profileForm.get(field);
    return !!(control && control.invalid && control.touched);
  }
}
