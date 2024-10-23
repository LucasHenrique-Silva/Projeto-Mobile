import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage {
  name: string = 'John Smith';
  email: string = 'john.smith@example.com';
  dateOfBirth: string = '1990-05-15';
  isModalOpen: boolean = false;
  selectedDate: string = this.dateOfBirth;
  isEmailValid: boolean = true;
  isNameValid: boolean = true;
  minDate: string;
  maxDate: string;
  profileForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController
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
      dateOfBirth: ['', Validators.required], // A data de nascimento é obrigatória
    });
  }

  // Método para salvar o perfil
  async saveProfile() {
    if (this.profileForm.invalid) {
      return;
    }
    // Adicione aqui a lógica para salvar o perfil
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
}
