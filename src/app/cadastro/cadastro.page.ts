import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './cadastro.page.html',
  styleUrls: ['./cadastro.page.scss'],
})
export class RegisterPage {
  profileForm: FormGroup;
  isModalOpen: boolean = false;
  minDate: string;
  maxDate: string;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
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

    // Inicializando o formulário com validações
    this.profileForm = this.formBuilder.group({
      name: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ÿ\s]{3,}$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      born_date: ['', Validators.required], // Alterado para born_date
      role: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  async onSubmit() {
    if (this.profileForm.valid) {
      // Pega os valores do formulário
      const formData = this.profileForm.value;


      try {
        // Envia a requisição para a API
        const response = await this.http
          .post(
            'https://projeto-mobile-api.vercel.app/api/v1/create/user',
            formData
          )
          .toPromise();
     

        // Exibe um alerta de sucesso
        const alert = await this.alertController.create({
          header: 'Sucesso',
          message: 'Conta criada com sucesso!',
          buttons: [
            {
              text: 'OK',
              handler: () => {
                // Redireciona para a home apenas após o clique em "OK"
                this.router.navigate(['/home']); // Substitua '/home' pela rota da sua página inicial
              },
            },
          ],
        });
        await alert.present();

        // Redireciona para a página inicial ou de login, conforme necessário
        this.router.navigate(['/login']); // ou o caminho que desejar
      } catch (error) {
        // Exibe um alerta de erro
        const alert = await this.alertController.create({
          header: 'Erro',
          message:
            'Ocorreu um erro ao criar a conta. Por favor, tente novamente.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    } else {
      // Marque todos os campos como "tocados" para exibir os erros de validação
      this.profileForm.markAllAsTouched();
    }
  }

  openDatePicker() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  isFieldInvalid(field: string): boolean {
    const control = this.profileForm.get(field);
    return !!(control && control.invalid && control.touched);
  }

  saveDate() {
    const dateOfBirth = this.profileForm.get('dateOfBirth')?.value;
    this.profileForm.patchValue({ dateOfBirth });
    this.isModalOpen = false;
  }
}
